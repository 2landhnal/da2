import amqp from 'amqplib';
import { setupConsumers } from './consumer';
import { setupProducers } from './producer';

let channel;

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
        await setupProducers(channel);
        await setupConsumers(channel);

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
