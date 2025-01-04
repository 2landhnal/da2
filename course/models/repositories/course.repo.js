import { CourseStatus } from '../../utils/couseStatus.js';
import Course from '../course.model.js';
export const createCourse = async ({ id, credit, ...others }) => {
    try {
        const newCourse = new Course({
            id,
            credit,
            ...others,
        });
        await newCourse.save();
        return newCourse;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

export const queryCourse = async ({ page, resultPerPage, query }) => {
    try {
        // Skip calculation for pagination
        const skip = (page - 1) * resultPerPage;

        // Parse the query string (e.g., "Coursername=abc") into a MongoDB query object
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
        const foundCourses = await Course.find(queryObject)
            .skip(skip)
            .limit(resultPerPage);

        // Return paginated results and metadata
        return foundCourses;
    } catch (error) {
        console.error('Error querying courses:', error);
        throw error;
    }
};

export const deleteCourseById = async ({ id }) => {
    try {
        const found = await Course.deleteOne({ id });
        console.log('Course delete: ', found);
        return found;
    } catch (error) {
        console.error('Error delete course:', error);
        throw error;
    }
};

export const closeCourseById = async ({ id }) => {
    try {
        const found = await Course.findOne({ id });
        found.status = CourseStatus.CLOSED;
        await found.save();
        console.log('Course closed: ', found);
        return found;
    } catch (error) {
        console.error('Error closed course:', error);
        throw error;
    }
};

export const findCourseWithId = async ({ id }) => {
    try {
        const found = await Course.findOne({ id });
        return found;
    } catch (error) {
        console.error('Error finding Course:', error);
        throw error;
    }
};

export const updateCourseInfor = async ({ id, ...updates }) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true }, // Return the updated document
        );
        return updatedCourse;
    } catch (error) {
        console.error('Error updating Course:', error);
        throw error;
    }
};
