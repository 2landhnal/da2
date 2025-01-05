'use strict';
import { requestHandler } from '../../helpers/requestHandler.js';
import { deleteStudentByUid } from '../../models/repositories/student.repo.js';
import { TmpRepo } from '../../models/repositories/tmp.repo.js';
import { StudentService } from '../../services/student.service.js';

export async function setupConsumers(channel) {
    try {
        const consumeQueues = [
            'testMQ',
            'student_delete',
            'noti_send',
            'student_changeAvatarUrl',
            'student_changeAvatar',
        ];

        for (const queue of consumeQueues) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`Listening queue [${queue}]`);
        }

        channel.consume('testMQ', (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('student_delete', async (msg) => {
            console.log(msg.content.toString());
            if (msg !== null) {
                console.log(`[x] Received delete student request`);
                const infor = JSON.parse(msg.content.toString());
                const [error, value] = await await requestHandler(
                    deleteStudentByUid({ uid: infor.uid }),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('student_changeAvatarUrl', async (msg) => {
            if (msg !== null) {
                console.log(`[x] Detect change avatar, syncing`);
                const msgObject = JSON.parse(msg.content.toString());
                const [error, value] = await await requestHandler(
                    StudentService.update({ ...msgObject }),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('student_changeAvatar', async (msg) => {
            const uploadAvatar = async (msgObject) => {
                const buffer = TmpRepo.getFileBuferFromPath(msgObject);
                const file = { buffer, ...msgObject };
                await StudentService.changeAvatar({ file, ...msgObject });
                await TmpRepo.deleteFileAsync(msgObject);
            };
            if (msg !== null) {
                console.log(`[x] Received chnage avatar request`);
                const msgObject = JSON.parse(msg.content.toString());
                const [error, value] = await await requestHandler(
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
