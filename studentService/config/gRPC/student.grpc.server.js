import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';
import { findStudentWithUid } from '../../models/repositories/student.repo.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/student.proto', {});
const studentPackage =
    grpc.loadPackageDefinition(packageDefinition).studentPackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(studentPackage.StudentService.service, {
        getStudent,
    });

    const grpcAddress = `0.0.0.0:${process.env.studentGRPC}`;

    server.bindAsync(
        grpcAddress,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`GRPC server running at ${grpcAddress}`);
        },
    ); // our sever is insecure, no ssl configuration
};

const getStudent = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { studentId } = params;
        const student = await findStudentWithUid({ uid: studentId });
        return { student };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Get student success!');
        callback(
            null,
            successGRPC({
                metadata: data,
            }),
        );
    } else {
        callback(failedGRPC({ message: 'Student not found' }), null);
    }
};
