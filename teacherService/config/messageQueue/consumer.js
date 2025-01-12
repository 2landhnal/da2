'use strict';
import { requestHandler } from '../../helpers/requestHandler.js';
import { TeacherRepo } from '../../models/repositories/teacher.repo.js';
import { TmpRepo } from '../../models/repositories/tmp.repo.js';
import { myConsume } from '../../helpers/mq.helper.js';
import { HelpService } from '../../services/help.service.js';

export async function setupConsumers(channel) {
    try {
        myConsume({ channel, queue: 'testMQ' });
        myConsume({
            channel,
            queue: 'teacher_syncStatus',
            callback: async ({ msgObject, queue }) => {
                await TeacherRepo.updateTeacherStatus(msgObject);
            },
        });
        myConsume({
            channel,
            queue: 'teacher_delete',
            callback: async ({ msgObject, queue }) => {
                await TeacherRepo.deleteTeacherByUid({ uid: msgObject.uid });
            },
        });
        myConsume({
            channel,
            queue: 'teacher_changeAvatarUrl',
            callback: async ({ msgObject, queue }) => {
                await TeacherService.update({ ...msgObject });
            },
        });
        myConsume({
            channel,
            queue: 'teacher_changeAvatar',
            callback: async ({ msgObject, queue }) => {
                const { uid } = msgObject;
                const teacher = await TeacherRepo.findTeacherWithUid({ uid });
                if (!teacher) {
                    console.log(
                        `[x] From consumer [${queue}]: Teacher with uid ${uid} not existed`,
                    );
                    return;
                }
                const buffer = TmpRepo.getFileBuferFromPath(msgObject);
                const file = { buffer, ...msgObject };
                await HelpService.changeAvatar({ file, uid });
                await TmpRepo.deleteFileAsync(msgObject);
            },
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
