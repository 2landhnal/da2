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
    /**
     * @param {String} infor - JOSN.stringify{yoa, semesterId}
     * @returns {Object} obj - {metadata: {allowed}, code, message}
     */
    static isStudentAllowed = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            semesterClient.isStudentAllowed({ infor }, (err, response) => {
                if (err) {
                    console.error('Check student allowed error:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Check student allowed success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
