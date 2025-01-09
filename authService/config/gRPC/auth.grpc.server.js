import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { AuthService } from '../../services/auth.service.js';
import { generatePassword } from '../../helpers/index.js';
import { sendToQueue } from '../messageQueue/connect.js';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/auth.proto', {});
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(authPackage.AuthService.service, {
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
    const accountRequest = { ...params, password };
    const fun = async () => {
        await AuthService.register(accountRequest);
        console.log('Create account from grpc success!');
        return accountRequest;
    };
    const [error, data] = await await requestHandler(fun());
    if (error) {
        callback(failedGRPC({ message: error }), null);
    } else {
        callback(null, successGRPC({ metadata: data }));
    }
    // Send noti
    sendToQueue('noti_send', JSON.stringify(accountRequest));
};
