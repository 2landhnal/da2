import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/course.proto', {});
const coursePackage =
    grpc.loadPackageDefinition(packageDefinition).coursePackage;

const courseClient = new coursePackage.CourseService(
    `${process.env.courseService}:${process.env.courseGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCCourseClient {
    static isCourseActive = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            courseClient.isCourseActive({ infor }, (err, response) => {
                if (err) {
                    console.error('Check course error:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Check course success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };

    static getCourse = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            courseClient.getCourse({ infor }, (err, response) => {
                if (err) {
                    console.error('Get course error:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Get course success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
