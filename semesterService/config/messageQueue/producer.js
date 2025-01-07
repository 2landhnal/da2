export async function setupProducers(channel) {
    try {
        const producerQueues = process.env.qList.split(' ');

        for (const queue of producerQueues) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`Ready to produce to queue [${queue}]`);
        }
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
}
