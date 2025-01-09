import Class from '../class.model.js';

export class ClassRepo {
    static createClass = async (infor) => {
        try {
            const newClass = new Class(infor);
            await newClass.save();
            return newClass;
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    };

    static queryClass = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Classrname=abc") into a MongoDB query object
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
            const foundClasss = await Class.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundClasss;
        } catch (error) {
            console.error('Error querying classs:', error);
            throw error;
        }
    };

    static deleteClassById = async ({ id }) => {
        try {
            const found = await Class.deleteOne({ id });
            console.log('Class delete: ', found);
            return found;
        } catch (error) {
            console.error('Error delete class:', error);
            throw error;
        }
    };

    static findClassById = async ({ id }) => {
        try {
            const found = await Class.findOne({ id });
            return found;
        } catch (error) {
            console.error('Error finding class:', error);
            throw error;
        }
    };

    static findClassByRoomId = async ({ roomId }) => {
        try {
            const founds = await Class.find({ roomId });
            return founds;
        } catch (error) {
            console.error('Error finding class:', error);
            throw error;
        }
    };

    static findClassByTeacherId = async ({ teacherId }) => {
        try {
            const founds = await Class.find({ teacherId });
            return founds;
        } catch (error) {
            console.error('Error finding class:', error);
            throw error;
        }
    };

    static findClassByCourseId = async ({ courseId }) => {
        try {
            const founds = await Class.find({ courseId });
            return founds;
        } catch (error) {
            console.error('Error finding class:', error);
            throw error;
        }
    };

    static countClass = async () => {
        try {
            const count = await Class.countDocuments({});
            return count;
        } catch (error) {
            console.error('Error finding class:', error);
            throw error;
        }
    };

    static getOpenCourseIds = async ({ semesterId }) => {
        try {
            // Truy vấn tất cả các lớp học trong kỳ với điều kiện hiện tại đang mở (maxCapacity > currentEnroll)
            const classes = await Class.find({
                semesterId,
            });

            // Lấy danh sách các courseId không bị trùng lặp
            const courseIds = [...new Set(classes.map((c) => c.courseId))];

            return courseIds;
        } catch (error) {
            console.error('Error retrieving open courseIds:', error);
            throw error;
        }
    };

    static updateClassInfor = async ({ id, ...updates }) => {
        try {
            const updatedClass = await Class.findOneAndUpdate(
                { id },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedClass;
        } catch (error) {
            console.error('Error updating class:', error);
            throw error;
        }
    };
}
