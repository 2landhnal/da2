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
        isCourseActive,
        getCourse,
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

const isCourseActive = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { id } = params;
        const course = await findCourseWithId({ id });
        const active = course.status === CourseStatus.ACTIVE;
        return { active };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Check course active success!');
        callback(
            null,
            successGRPC({
                metadata: data,
            }),
        );
    } else {
        callback(failedGRPC({ message: 'Course not found' }), null);
    }
};

const getCourse = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { id } = params;
        const course = await findCourseWithId({ id });
        return { course };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Get course success!');
        callback(
            null,
            successGRPC({
                metadata: data,
            }),
        );
    } else {
        callback(failedGRPC({ message: 'Course not found' }), null);
    }
};
