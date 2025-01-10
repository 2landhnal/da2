'use strict';
import { myConsume } from '../../helpers/mq.helper.js';
import { EnrollmentRepo } from '../../models/repositories/enrollment.repo.js';

export async function setupConsumers(channel) {
    try {
        myConsume({ channel, queue: 'testMQ' });
        myConsume({
            channel,
            queue: 'enrollment_finishEnrollment',
            callback: async ({ msgObject, queue }) => {
                await EnrollmentRepo.finishEnrollements(msgObject);
            },
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
