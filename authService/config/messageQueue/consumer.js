'use strict';
import { requestHandler } from '../../helpers/requestHandler.js';
import { AuthService } from '../../services/auth.service.js';

export const setupConsumers = (channel) => {
    try {
        channel.consume('testMQ', (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('noti_send', (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });

        channel.consume('sync_infor', async (msg) => {
            if (msg !== null) {
                const msgObject = JSON.parse(msg.content.toString());
                if (msgObject === null) {
                    console.log('Null massage, skipped');
                    channel.ack(msg);
                    return;
                }
                console.log(`[x] Received: ${JSON.stringify(msgObject)}`);
                const [error, data] = await await requestHandler(
                    AuthService.syncInfor(msgObject),
                );
                if (error) {
                    console.log(error);
                    return;
                }
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
};
