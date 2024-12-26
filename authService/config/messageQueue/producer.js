export const sendToQueue = (channel, queue, message) => {
    channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
    });
    console.log(`[x] Sent: ${message}`);
};

export async function setupProducers(channel) {
    try {
        const producerQueues = ['testMQ'];

        for (const queue of producerQueues) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`Ready to produce to queue [${queue}]`);
        }

        sendToQueue(channel, 'testMQ', 'Hello world from MQ producer!');
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
