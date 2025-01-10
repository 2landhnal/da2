'use strict';
import { requestHandler } from '../../helpers/requestHandler.js';
import {
    deleteStudentByUid,
    updateStudentStatus,
} from '../../models/repositories/student.repo.js';
import { TmpRepo } from '../../models/repositories/tmp.repo.js';
import { StudentService } from '../../services/student.service.js';
import { myConsume } from '../../helpers/mq.helper.js';

export async function setupConsumers(channel) {
    try {
        myConsume({ channel, queue: 'testMQ' });
        myConsume({
            channel,
            queue: 'student_syncStatus',
            callback: async ({ msgObject, queue }) => {
                await updateStudentStatus(msgObject);
            },
        });
        myConsume({
            channel,
            queue: 'student_delete',
            callback: async ({ msgObject, queue }) => {
                await deleteStudentByUid({ uid: msgObject.uid });
            },
        });
        myConsume({
            channel,
            queue: 'student_changeAvatarUrl',
            callback: async ({ msgObject, queue }) => {
                await StudentService.update({ ...msgObject });
            },
        });

        myConsume({
            channel,
            queue: 'student_changeAvatar',
            callback: async ({ msgObject, queue }) => {
                const buffer = TmpRepo.getFileBuferFromPath(msgObject);
                const file = { buffer, ...msgObject };
                await StudentService.changeAvatar({ file, ...msgObject });
                await TmpRepo.deleteFileAsync(msgObject);
            },
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
