import { requestHandler } from './requestHandler.js';

export const myConsume = ({ channel, queue, callback = () => {} }) => {
    channel.consume(queue, async (msg) => {
        const msgContent = msg.content.toString();
        if (msg !== null) {
            const fun = async () => {
                const [isJSON, msgObject] = tryParse(msgContent);
                if (!isJSON) {
                    console.log(
                        `[x] From consumer [${queue}]: Not object, ack`,
                    );
                    return;
                }
                if (msgObject === null) {
                    console.log(
                        `[x] From consumer [${queue}]: Null massage, skipped`,
                    );
                    return;
                }
                console.log(
                    `[x] From consumer [${queue}]: Received ${JSON.stringify(
                        msgObject,
                    )}`,
                );
                await callback({ msgObject, queue });
            };
            const [error, data] = await await requestHandler(fun());
            if (error) {
                console.log(error);
                return;
            }
            console.log(`[x] From consumer [${queue}]: Ack '${msgContent}'`);
            channel.ack(msg); // Xác nhận đã xử lý thông điệp
        }
    });
};

export const tryParse = (str) => {
    let obj;
    try {
        obj = JSON.parse(str);
    } catch (e) {
        return [false, null];
    }
    return [true, obj];
};
