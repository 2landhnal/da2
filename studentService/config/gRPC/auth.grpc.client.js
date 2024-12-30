import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { sendToQueue } from '../messageQueue/connect.js';
import { promisify } from 'util';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/auth.proto', {});
const authPakage = grpc.loadPackageDefinition(packageDefinition).authPakage;

export const authClient = new authPakage.AuthService(
    `localhost:${process.env.authGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export const createAccount = async ({ infor }) => {
    const createAccountAsync = promisify(
        authClient.createAccount.bind(authClient),
    );

    try {
        const response = await createAccountAsync({ infor });
        console.log(`Response server: `, JSON.stringify(response));
    } catch (err) {
        const { uid } = JSON.parse(infor);
        sendToQueue('student_delete', JSON.stringify({ uid }));
        throw new BadRequestError();
    }
};
