import { getChannel } from './connect.js';

export const sendToQueue = (queue, message) => {
    const channel = getChannel();
    channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
    });
    console.log(`[x] Sent: ${message}`);
};

export async function setupProducers() {
    try {
        const channel = getChannel();
        const producerQueues = ['testMQ'];

        for (const queue of producerQueues) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`Ready to produce to queue [${queue}]`);
        }

        sendToQueue('testMQ', 'Hello world from MQ producer!');
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
