import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/student.proto', {});
const studentPackage =
    grpc.loadPackageDefinition(packageDefinition).studentPackage;

const studentClient = new studentPackage.StudentService(
    `${process.env.studentService}:${process.env.studentGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCStudentClient {
    /**
     * @param {String} infor - JOSN.stringify{studentId}
     * @returns {Object} obj - {metadata: {student}, code, message}
     */
    static getStudent = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            studentClient.getStudent({ infor }, (err, response) => {
                if (err) {
                    console.error('Get student error:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Get student success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
