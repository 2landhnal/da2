'use strict';
import { myConsume } from '../../helpers/mq.helper.js';
import { ClassRepo } from '../../models/repositories/class.repo.js';
import { gRPCEnrollmentClient } from '../gRPC/enrollment.grpc.client.js';

export async function setupConsumers(channel) {
    try {
        myConsume({ channel, queue: 'testMQ' });
        myConsume({
            channel,
            queue: 'class_syncEnroll',
            callback: async (msgObject, queue) => {
                const currentEnroll =
                    await gRPCEnrollmentClient.getCurrentEnrollment(
                        JSON.stringify({ msgObject }),
                    );
                await ClassRepo.updateClassInfor({
                    id: msgObject.classId,
                    currentEnroll,
                });
            },
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
