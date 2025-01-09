import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { findCourseWithId } from '../../models/repositories/course.repo.js';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { CourseStatus } from '../../utils/couseStatus.js';
import { requestHandler } from '../../helpers/requestHandler.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/course.proto', {});
const coursePackage =
    grpc.loadPackageDefinition(packageDefinition).coursePackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(coursePackage.CourseService.service, {
        isCourseOpen,
    });

    const grpcServerAddress = `0.0.0.0:${process.env.courseGRPC}`;

    server.bindAsync(
        grpcServerAddress,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`GRPC server running at ${grpcServerAddress}`);
        },
    ); // our sever is insecure, no ssl configuration
};

const isCourseOpen = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { id } = params;
        const { course } = await findCourseWithId({ id });
        const open = course.status === CourseStatus.ACTIVE;
        return { open };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Check course open success!');
        callback(
            null,
            JSON.stringify(
                successGRPC({
                    metadata: data,
                }),
            ),
        );
    } else {
        callback(failedGRPC({ message: 'Course not found' }), null);
    }
};
