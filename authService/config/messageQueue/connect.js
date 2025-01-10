'use strict';
import amqp from 'amqplib';
import { setupConsumers } from './consumer.js';

let channel;
const liseningQueues = [
    'testMQ',
    'sync_infor',
    'noti_send',
    'student_syncStatus',
    'teacher_syncStatus',
    'account_delete',
];

export async function connectRabbitMQ() {
    try {
        const mqUrl = process.env.mqUrl || 'amqp://localhost';
        const connection = await amqp.connect(mqUrl);
        channel = await connection.createChannel();
        const maxPrefetch = 100;
        channel.prefetch(maxPrefetch); // Allow max 100 messages processing at a time

        console.log(
            `RabbitMQ connected and channel created. Allow max ${maxPrefetch} messages processing at a time`,
        );

        for (const queue of liseningQueues) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`Listening queue [${queue}]`);
        }

        await setupConsumers(channel);
        sendToQueue('testMQ', 'Hello world from MQ producer!');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('Closing RabbitMQ connection...');
            await connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        process.exit(1);
    }
}

export const getChannel = () => {
    if (!channel) {
        throw new Error('Channel is not initialized yet');
    }
    return channel;
};

export const sendToQueue = (queue, message) => {
    channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
    });
    console.log(`[x] Sent to queue [${queue}]: ${message}`);
};
