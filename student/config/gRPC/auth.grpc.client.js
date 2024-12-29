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
