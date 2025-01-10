import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync(
    'config/gRPC/enrollment.proto',
    {},
);
const enrollmentPackage =
    grpc.loadPackageDefinition(packageDefinition).enrollmentPackage;

const enrollmentClient = new enrollmentPackage.EnrollmentService(
    `${process.env.enrollmentService}:${process.env.enrollmentGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCEnrollmentClient {
    // infor = JSON.stringify({classId})
    static getCurrentEnrollment = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            enrollmentClient.getCurrentEnrollment(
                { infor },
                (err, response) => {
                    if (err) {
                        console.error('Check enrollment error:', err);
                        resolve(err); // Trả về false nếu có lỗi
                    } else {
                        const data = JSON.parse(response.response);
                        console.log('Check enrollment success:', data);
                        resolve(data); // Trả về true nếu thành công
                    }
                },
            );
        });
    };
}
