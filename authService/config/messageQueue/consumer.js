'use strict';
import { AuthService } from '../../services/auth.service.js';
import { myConsume } from '../../helpers/mq.helper.js';
import {
    deleteAccountByEmail,
    findAccountWithEmail,
} from '../../models/repositories/account.repo.js';

export const setupConsumers = (channel) => {
    try {
        myConsume({ channel, queue: 'testMQ' });
        myConsume({ channel, queue: 'noti_send' });
        myConsume({
            channel,
            queue: 'sync_infor',
            callback: async ({ msgObject, queue }) => {
                await AuthService.syncInfor(msgObject);
            },
        });
        myConsume({
            channel,
            queue: 'account_delete',
            callback: async ({ msgObject, queue }) => {
                const { email } = msgObject;
                const account = await findAccountWithEmail({ email });
                if (!account) {
                    console.log(`[${queue}]: Account not exist, ack`);
                    return;
                }
                await deleteAccountByEmail({ email });
            },
        });
    } catch (err) {
        console.error('Error setting up consumers:', err);
    }
};
