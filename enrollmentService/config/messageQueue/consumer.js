'use strict';
import { myConsume } from '../../helpers/mq.helper.js';

export async function setupConsumers(channel) {
    try {
        myConsume({ channel, queue: 'testMQ' });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
