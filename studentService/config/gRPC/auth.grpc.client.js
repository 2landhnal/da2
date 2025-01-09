import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { successGRPC, failedGRPC } from '../../responses/grpc.response.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/auth.proto', {});
const authPackage = grpc.loadPackageDefinition(packageDefinition).authPackage;

const authClient = new authPackage.AuthService(
    `${process.env.authService}:${process.env.authGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCAuthClient {
    static createAccount = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            authClient.createAccount({ infor }, (err, response) => {
                if (err) {
                    console.error('Error creating account:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Account created:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
