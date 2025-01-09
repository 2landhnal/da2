import Student from '../student.model.js';
export const createStudent = async ({
    uid,
    email,
    personalEmail,
    fullname,
    yoa,
    phone,
    address,
    dob,
    gender,
    avatar,
}) => {
    try {
        const newStudent = new Student({
            uid,
            email,
            personalEmail,
            fullname,
            yoa,
            phone,
            address,
            dob,
            gender,
            avatar,
        });
        await newStudent.save();
        return newStudent;
    } catch (error) {
        console.error('Error creating Student:', error);
        throw error;
    }
};

export const getNumberOfStudentWithYoa = async ({ yoa }) => {
    try {
        const num = await Student.where({
            yoa,
        }).countDocuments();
        return num;
    } catch (error) {
        console.error('Error querying students:', error);
        throw error;
    }
};

export const queryStudent = async ({ page, resultPerPage, query }) => {
    try {
        // Skip calculation for pagination
        const skip = (page - 1) * resultPerPage;

        // Parse the query string (e.g., "Studentrname=abc") into a MongoDB query object
        let queryObject = {};
        for (const field in query) {
            if (query[field]) {
                queryObject[field] = { $regex: query[field], $options: 'i' }; // 'i' để tìm kiếm không phân biệt hoa thường
            }
        }

        // Execute query with pagination
        const foundStudents = await Student.find(queryObject)
            .skip(skip)
            .limit(resultPerPage);

        // Return paginated results and metadata
        return foundStudents;
    } catch (error) {
        console.error('Error querying Students:', error);
        throw error;
    }
};

export const deleteStudentByUid = async ({ uid }) => {
    try {
        const found = await Student.deleteOne({ uid });
        console.log('Student delete: ', found);
        return found;
    } catch (error) {
        console.error('Error delete Student:', error);
        throw error;
    }
};

export const findStudentWithPersonalEmail = async ({ personalEmail }) => {
    try {
        const found = await Student.findOne({ personalEmail });

        return found;
    } catch (error) {
        console.error('Error finding Student:', error);
        throw error;
    }
};

export const findStudentWithUid = async ({ uid }) => {
    try {
        const found = await Student.findOne({ uid });
        return found;
    } catch (error) {
        console.error('Error finding Student:', error);
        throw error;
    }
};

export const updateStudentInfor = async ({ uid, ...updates }) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { uid },
            { $set: updates },
            { new: true }, // Return the updated document
        );
        return updatedStudent;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

export const updateStudentStatus = async ({ uid, accountStatus }) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { uid },
            { $set: { accountStatus } },
            { new: true }, // Return the updated document
        );
        return updatedStudent;
    } catch (error) {
        console.error('Error updating student accountStatus:', error);
        throw error;
    }
};
