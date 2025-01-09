import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { TeacherRepo } from '../../models/repositories/teacher.repo.js';
import { sendToQueue } from '../messageQueue/connect.js';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';
import { AccountStatus } from '../../../authService/utils/accountStatus.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/teacher.proto', {});
const teacherPakage =
    grpc.loadPackageDefinition(packageDefinition).teacherPakage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(teacherPakage.TeacherService.service, {
        isTeacherActive,
    });

    const grpcServerAddress = `0.0.0.0:${process.env.teacherGRPC}`;
    server.bindAsync(
        grpcServerAddress,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`GRPC server running at ${grpcServerAddress}`);
        },
    ); // our sever is insecure, no ssl configuration
};

const isTeacherActive = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { uid } = params;
        const teacher = await TeacherRepo.findTeacherWithUid({ uid });
        const active = teacher && teacher.active === AccountStatus.ACTIVE;
        return { active };
    };
    const [error, data] = await await requestHandler(fun());
    if (error) {
        callback(failedGRPC({ message: error }), null);
    } else {
        callback(null, JSON.stringify(successGRPC({ metadata: data })));
    }
};
