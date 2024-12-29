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
        // Ensure page and resultPerPage have default values if not provided
        const currentPage = page || 1;
        const resultsPerPage = resultPerPage || 10;

        // Skip calculation for pagination
        const skip = (currentPage - 1) * resultsPerPage;

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
            .limit(resultsPerPage);

        // Get the total count for the query
        const totalStudents = await Student.countDocuments(queryObject);

        // Return paginated results and metadata
        return {
            students: foundStudents,
            pagination: {
                currentPage,
                resultsPerPage,
                totalResults: totalStudents,
                totalPages: Math.ceil(totalStudents / resultsPerPage),
            },
        };
    } catch (error) {
        console.error('Error querying Students:', error);
        throw error;
    }
};

export const deleteStudentByUid = async ({ uid }) => {
    try {
        const found = await Student.findOne({ uid });
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
