import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { CourseService } from '../../services/course.service.js';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { CourseStatus } from '../../utils/couseStatus.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/course.proto', {});
const coursePackage =
    grpc.loadPackageDefinition(packageDefinition).coursePackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(coursePackage.CourseService.service, {
        checkCourseOpen,
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

const checkCourseOpen = async (call, callback) => {
    const params = JSON.parse(call.request.infor);
    const { id } = params;
    console.log({ id });
    const { course } = await CourseService.findById({ id });
    if (course) console.log('[GRPC]: Check course open success!');
    const open = course.status === CourseStatus.ACTIVE;
    if (course) {
        callback(null, successGRPC((metadata = { open })));
    } else {
        callback(failedGRPC('Course not found'), null);
    }
};
