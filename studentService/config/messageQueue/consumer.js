'use strict';
import {
    deleteStudentByUid,
    updateStudentStatus,
    updateStudentInfor,
    findStudentWithUid,
} from '../../models/repositories/student.repo.js';
import { TmpRepo } from '../../models/repositories/tmp.repo.js';
import { myConsume } from '../../helpers/mq.helper.js';
import { HelpService } from '../../services/help.service.js';
import { sendToQueue } from './connect.js';
import { RoleCode } from '../../utils/roleCode.js';

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
                const { uid, avatar } = msgObject;
                await updateStudentInfor({ uid, avatar });
                sendToQueue(
                    'sync_infor',
                    JSON.stringify({ role: RoleCode.STUDENT, uid, avatar }),
                );
            },
        });

        myConsume({
            channel,
            queue: 'student_changeAvatar',
            callback: async ({ msgObject, queue }) => {
                const { uid } = msgObject;
                const student = await findStudentWithUid({ uid });
                if (!student) {
                    console.log(
                        `[x] From consumer [${queue}]: Student with uid ${uid} not existed`,
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
