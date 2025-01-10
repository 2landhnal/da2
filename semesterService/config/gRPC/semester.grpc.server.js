import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import { failedGRPC, successGRPC } from '../../responses/grpc.response.js';
import { requestHandler } from '../../helpers/requestHandler.js';
import { SemesterRepo } from '../../models/repositories/semester.repo.js';
import { ScheduleService } from '../../services/schedule.service.js';

dotenv.config();

const packageDefinition = protoLoader.loadSync(
    'config/gRPC/semester.proto',
    {},
);
const semesterPackage =
    grpc.loadPackageDefinition(packageDefinition).semesterPackage;

export const init = () => {
    // Create a server
    const server = new grpc.Server();

    // Add the service
    server.addService(semesterPackage.SemesterService.service, {
        isSemesterOkayToAddClass,
        isStudentAllowed,
    });

    const address = `0.0.0.0:${process.env.semesterGRPC}`;

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`GRPC server running at ${address}`);
    }); // our sever is insecure, no ssl configuration
};

const isSemesterOkayToAddClass = async (call, callback) => {
    const fun = async () => {
        const { id } = JSON.parse(call.request.infor);
        const semester = await SemesterRepo.findSemesterWithId({ id });
        const now = Date.now();
        const okay = now <= semester.startDate;
        console.log('Check semester okay to add class from grpc success!');
        return { okay };
    };
    const [error, data] = await await requestHandler(fun());
    if (error) {
        callback(failedGRPC({ message: error }), null);
    } else {
        callback(null, successGRPC({ metadata: data }));
    }
};

const isStudentAllowed = async (call, callback) => {
    const fun = async () => {
        const { yoa, semesterId } = JSON.parse(call.request.infor);
        const { accessible, semesterIds } = await ScheduleService.checkAccess({
            yoa,
        });
        let allowed = false;
        if (accessible) {
            allowed = semesterIds.includes(semesterId);
        }
        console.log('Check isStudentAllow from grpc success!');
        return { allowed };
    };
    const [error, data] = await await requestHandler(fun());
    if (error) {
        callback(failedGRPC({ message: error }), null);
    } else {
        callback(null, successGRPC({ metadata: data }));
    }
};
