'use strict';
import { deleteStudentByUid } from '../../models/repositories/student.repo.js';

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

        channel.consume('student_delete', async (msg) => {
            console.log(msg.content.toString());
            if (msg !== null) {
                console.log(`[x] Received delete student request`);
                const infor = JSON.parse(msg.content.toString());
                await deleteStudentByUid({ uid: infor.uid });
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('noti_send', (msg) => {
            if (msg !== null) {
                console.log(`[x] Received noti request, mailing...`);
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
