import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';
import { ClassRepo } from '../../models/repositories/class.repo.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/class.proto', {});
const classPackage = grpc.loadPackageDefinition(packageDefinition).classPackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(classPackage.ClassService.service, {
        getClass,
    });

    const grpcAddress = `0.0.0.0:${process.env.classGRPC}`;

    server.bindAsync(
        grpcAddress,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`GRPC server running at ${grpcAddress}`);
        },
    ); // our sever is insecure, no ssl configuration
};

const getClass = async (call, callback) => {
    const fun = async () => {
        const params = JSON.parse(call.request.infor);
        const { classId } = params;
        const _class = await ClassRepo.findClassById({ id: classId });
        return { _class };
    };
    const [error, data] = await await requestHandler(fun());
    if (!error) {
        console.log('[GRPC]: Get class success!');
        callback(
            null,
            successGRPC({
                metadata: data,
            }),
        );
    } else {
        callback(failedGRPC({ message: 'Class not found' }), null);
    }
};
