import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/teacher.proto', {});
const teacherPackage =
    grpc.loadPackageDefinition(packageDefinition).teacherPackage;

const teacherClient = new teacherPackage.TeacherService(
    `${process.env.teacherService}:${process.env.teacherGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCTeacherClient {
    static isTeacherActive = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            teacherClient.isTeacherActive({ infor }, (err, response) => {
                if (err) {
                    console.error('Check teacher error :', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Check teacher success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };

    static getTeacher = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            teacherClient.getTeacher({ infor }, (err, response) => {
                if (err) {
                    console.error('Get teacher error :', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Get teacher success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
