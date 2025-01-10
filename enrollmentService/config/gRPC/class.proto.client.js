import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';

dotenv.config();

const packageDefinition = protoLoader.loadSync('config/gRPC/class.proto', {});
const classPackage = grpc.loadPackageDefinition(packageDefinition).classPackage;

const classClient = new classPackage.ClassService(
    `${process.env.classService}:${process.env.classGRPC}`,
    // replace by service:grpcPort
    grpc.credentials.createInsecure(),
);

export class gRPCClassClient {
    /**
     * @param {String} infor - JOSN.stringify{classId}
     * @returns {Object} obj - {metadata: {_class}, code, message}
     */
    static getClass = async ({ infor }) => {
        return new Promise((resolve, reject) => {
            classClient.getClass({ infor }, (err, response) => {
                if (err) {
                    console.error('Get class error:', err);
                    resolve(err); // Trả về false nếu có lỗi
                } else {
                    const data = JSON.parse(response.response);
                    console.log('Get class success:', data);
                    resolve(data); // Trả về true nếu thành công
                }
            });
        });
    };
}
