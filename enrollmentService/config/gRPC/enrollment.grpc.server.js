import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';
import { EnrollmentRepo } from '../../models/repositories/enrollment.repo.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync(
    'config/gRPC/enrollment.proto',
    {},
);
const enrollmentPackage =
    grpc.loadPackageDefinition(packageDefinition).enrollmentPackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(enrollmentPackage.EnrollmentService.service, {
        getCurrentEnrollment,
    });

    const grpcAddress = `0.0.0.0:${process.env.enrollmentGRPC}`;

    server.bindAsync(
        grpcAddress,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`GRPC server running at ${grpcAddress}`);
        },
    ); // our sever is insecure, no ssl configuration
};

const getCurrentEnrollment = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { classId } = params;
        console.log(params);
        const currentEnrollment =
            await EnrollmentRepo.getNumberOfStudentInClass({
                classId,
            });
        console.log({ currentEnrollment });
        return { currentEnrollment };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Get current enrollment success!', data);
        callback(
            null,
            successGRPC({
                metadata: data,
            }),
        );
    } else {
        console.log('[GRPC]: Get current enrollment failed!', error);
        callback(failedGRPC({ message: 'Enrollment not found' }), null);
    }
};
