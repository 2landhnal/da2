import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync(
    'config/gRPC/semester.proto',
    {},
);
const semesterPackage =
    grpc.loadPackageDefinition(packageDefinition).semesterPackage;

const semesterClient = new semesterPackage.SemesterService(
    `${process.env.semesterService}:${process.env.semesterGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCSemesterClient {
    static isSemesterOkayToAddClass = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            semesterClient.isSemesterOkayToAddClass(
                { infor },
                (err, response) => {
                    if (err) {
                        console.error('Check semester error:', err);
                        resolve(err); // Trả về false nếu có lỗi
                    } else {
                        const data = JSON.parse(response.response);
                        console.log('Check semester success:', data);
                        resolve(data); // Trả về true nếu thành công
                    }
                },
            );
        });
    };
}
