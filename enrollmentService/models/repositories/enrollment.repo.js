import { EnrollmentStatus } from '../../utils/enrollmentStatus.js';
import Enrollment from '../enrollment.model.js';

export class EnrollmentRepo {
    static createEnrollment = async ({ id, ...others }) => {
        try {
            const newEnrollment = new Enrollment({
                id,
                ...others,
            });
            await newEnrollment.save();
            return newEnrollment;
        } catch (error) {
            console.error('Error creating enrollment:', error);
            throw error;
        }
    };

    static queryEnrollment = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Enrollmentrname=abc") into a MongoDB query object
            let queryObject = {};
            for (const field in query) {
                if (query[field]) {
                    if (typeof query[field] === 'string') {
                        queryObject[field] = {
                            $regex: query[field],
                            $options: 'i',
                        }; // Tìm kiếm không phân biệt hoa thường
                    } else {
                        queryObject[field] = query[field]; // Gán trực tiếp nếu không phải chuỗi
                    }
                }
            }

            // Execute query with pagination
            const foundEnrollments = await Enrollment.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundEnrollments;
        } catch (error) {
            console.error('Error querying enrollments:', error);
            throw error;
        }
    };

    static deleteEnrollment = async ({ studentId, classIds }) => {
        try {
            const found = await Enrollment.deleteMany({
                studentId,
                classId: { $in: classIds },
            });
            console.log('Enrollments delete: ', found);
            return found;
        } catch (error) {
            console.error('Error delete enrollment:', error);
            throw error;
        }
    };

    static getStudentEnrollmentCredit = async ({ studentId, semesterId }) => {
        try {
            const enrollments = await Enrollment.find({
                studentId,
                semesterId,
            });
            let credit = 0;
            enrollments.forEach((enrollment) => {
                credit += enrollment.courseCredit;
            });
            return credit;
        } catch (error) {
            console.error('Error delete enrollment:', error);
            throw error;
        }
    };

    static findEnrollment = async ({ studentId, classId }) => {
        try {
            const found = await Enrollment.findOne({ studentId, classId });
            return found;
        } catch (error) {
            console.error('Error finding Enrollment:', error);
            throw error;
        }
    };

    static getStudentInClass = async ({ classId }) => {
        try {
            const found = await Enrollment.find({ classId }).select(
                'studentId studentName studentAvatar',
            );
            return found;
        } catch (error) {
            console.error('Error finding Enrollment:', error);
            throw error;
        }
    };

    static countEnrollmentInSemester = async ({ semesterId }) => {
        try {
            const count = await Enrollment.countDocuments({ semesterId });
            return count;
        } catch (error) {
            console.error('Error finding Enrollment:', error);
            throw error;
        }
    };

    static getNumberOfStudentInClass = async ({ classId }) => {
        try {
            const count = await Enrollment.countDocuments({ classId });
            return count;
        } catch (error) {
            console.error('Error finding Enrollment:', error);
            throw error;
        }
    };

    static closeEnrollements = async ({ classId }) => {
        try {
            const result = await Enrollment.updateMany(
                { classId }, // Điều kiện lọc
                { $set: { status: EnrollmentStatus.CLOSED } }, // Thay đổi cần áp dụng
            );

            console.log('Enrollments updated:', result);
            return result; // Trả về kết quả cập nhật
        } catch (error) {
            console.error('Error updating Enrollment:', error);
            throw error;
        }
    };

    static getRegisteredClass = async ({ studentId, semesterId }) => {
        try {
            const founds = await Enrollment.find({ studentId, semesterId });
            return founds;
        } catch (error) {
            console.error('Error finding Enrollment:', error);
            throw error;
        }
    };
}
