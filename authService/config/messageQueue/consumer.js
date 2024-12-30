'use strict';
import { AuthService } from '../../services/auth.service.js';

export async function setupConsumers(channel) {
    try {
        const consumeQueues = process.env.qList.split(' ');

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

        channel.consume('sync_student', async (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                await AuthService.syncInfor(JSON.parse(msg.content.toString()));
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
