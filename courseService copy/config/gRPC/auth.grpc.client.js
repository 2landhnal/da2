import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/auth.proto', {});
const authPakage = grpc.loadPackageDefinition(packageDefinition).authPakage;

export const authClient = new authPakage.AuthService(
    `localhost:${process.env.authGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export const createAccount = async ({ infor }) => {
    return new Promise((resolve, reject) => {
        authClient.createAccount({ infor }, (err, response) => {
            if (err) {
                console.error('Error creating account:', err);
                resolve(false); // Trả về false nếu có lỗi
            } else {
                console.log('Account created:', response);
                resolve(true); // Trả về true nếu thành công
            }
        });
    });
};
