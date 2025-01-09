'use strict';
import { requestHandler } from '../../helpers/requestHandler.js';
import { TeacherRepo } from '../../models/repositories/teacher.repo.js';
import { TmpRepo } from '../../models/repositories/tmp.repo.js';
import { TeacherService } from '../../services/teacher.service.js';

export async function setupConsumers(channel) {
    try {
        channel.consume('testMQ', (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('teacher_syncStatus', async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                console.log(`[x] Received sync status request ${content}`);
                const infor = JSON.parse(content);
                const [error, data] = await await requestHandler(
                    // infor: {uid, accountStatus}
                    TeacherRepo.updateTeacherStatus(infor),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('teacher_delete', async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                console.log(`[x] Received delete teacher request ${content}`);
                const infor = JSON.parse(content);
                const [error, data] = await await requestHandler(
                    TeacherRepo.deleteTeacherByUid({ uid: infor.uid }),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('teacher_changeAvatarUrl', async (msg) => {
            if (msg !== null) {
                console.log(`[x] Detect change avatar, syncing`);
                const msgObject = JSON.parse(msg.content.toString());
                const [error, data] = await await requestHandler(
                    TeacherService.update({ ...msgObject }),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('teacher_changeAvatar', async (msg) => {
            const uploadAvatar = async (msgObject) => {
                const { uid } = msgObject;
                const teacher = await TeacherRepo.findTeacherWithUid({ uid });
                if (!teacher) {
                    console.log(
                        `[teacher_changeAvatar] Teacher with uid ${uid} not existed`,
                    );
                    channel.ack(msg);
                    return;
                }
                const buffer = TmpRepo.getFileBuferFromPath(msgObject);
                const file = { buffer, ...msgObject };
                await TeacherService.changeAvatar({ file, ...msgObject });
                await TmpRepo.deleteFileAsync(msgObject);
            };
            if (msg !== null) {
                console.log(`[x] Received change avatar request`);
                const msgObject = JSON.parse(msg.content.toString());
                const [error, data] = await await requestHandler(
                    uploadAvatar(msgObject),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
