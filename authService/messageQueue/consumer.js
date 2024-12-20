import { getChannel } from './connect.js';
import accountController from '../controllers/accountController.js';

export async function setupConsumers() {
    try {
        const channel = getChannel();
        const consumeQueues = ['testMQ', 'signUpAccount'];

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
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
