import Teacher from '../teacher.model.js';
export class TeacherRepo {
    static createTeacher = async ({ ...infor }) => {
        try {
            const newTeacher = new Teacher({
                ...infor,
            });
            await newTeacher.save();
            return newTeacher;
        } catch (error) {
            console.error('Error creating Teacher:', error);
            throw error;
        }
    };

    static getNumberOfTeacherWithYoj = async ({ yoj }) => {
        try {
            const num = await Teacher.where({
                yoj,
            }).countDocuments();
            return num;
        } catch (error) {
            console.error('Error querying teachers:', error);
            throw error;
        }
    };

    static queryTeacher = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Teacherrname=abc") into a MongoDB query object
            let queryObject = {};
            for (const field in query) {
                if (query[field]) {
                    queryObject[field] = {
                        $regex: query[field],
                        $options: 'i',
                    }; // 'i' để tìm kiếm không phân biệt hoa thường
                }
            }

            // Execute query with pagination
            const foundTeachers = await Teacher.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundTeachers;
        } catch (error) {
            console.error('Error querying Teachers:', error);
            throw error;
        }
    };

    static findTeacherWithEmail = async ({ email }) => {
        try {
            const found = await Teacher.findOne({ email });
            return found;
        } catch (error) {
            console.error('Error finding Teacher:', error);
            throw error;
        }
    };

    static findTeacherWithUid = async ({ uid }) => {
        try {
            const found = await Teacher.findOne({ uid });
            return found;
        } catch (error) {
            console.error('Error finding teacher:', error);
            throw error;
        }
    };

    static deleteTeacherByUid = async ({ uid }) => {
        try {
            const found = await Teacher.deleteOne({ uid });
            console.log('Teacher delete: ', found);
            return found;
        } catch (error) {
            console.error('Error delete Teacher:', error);
            throw error;
        }
    };

    static updateTeacherInfor = async ({ uid, ...updates }) => {
        try {
            const updatedTeacher = await Teacher.findOneAndUpdate(
                { uid },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedTeacher;
        } catch (error) {
            console.error('Error updating teacher:', error);
            throw error;
        }
    };

    static updateTeacherStatus = async ({ uid, accountStatus }) => {
        try {
            const updatedTeacher = await Teacher.findOneAndUpdate(
                { uid },
                { $set: { accountStatus } },
                { new: true }, // Return the updated document
            );
            return updatedTeacher;
        } catch (error) {
            console.error('Error updating teacher accountStatus:', error);
            throw error;
        }
    };
}
