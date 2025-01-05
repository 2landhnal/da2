import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { AuthService } from '../../services/auth.service.js';
import { generatePassword } from '../../helpers/index.js';
import { sendToQueue } from '../messageQueue/connect.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/auth.proto', {});
const authPakage = grpc.loadPackageDefinition(packageDefinition).authPakage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(authPakage.AuthService.service, {
        createAccount,
    });

    server.bindAsync(
        `0.0.0.0:${process.env.authGRPC}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(
                `GRPC server running at 0.0.0.0:${process.env.authGRPC}`,
            );
        },
    ); // our sever is insecure, no ssl configuration
};

const createAccount = async (call, callback) => {
    const params = JSON.parse(call.request.infor);
    const password = generatePassword();
    console.log({ password });
    await AuthService.register({ ...params, password });
    console.log('Create account from grpc success!');
    // Send noti
    sendToQueue('noti_send', JSON.stringify({ ...params, password }));
    callback(null, params);
};
