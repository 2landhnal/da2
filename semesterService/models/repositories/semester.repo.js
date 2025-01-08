import { SemesterStatus } from '../../utils/semesterStatus.js';
import Semester from '../semester.model.js';

export class SemesterRepo {
    static createSemester = async ({
        id,
        startDate,
        endDate,
        status,
        ...others
    }) => {
        try {
            const newSemester = new Semester({
                id,
                startDate,
                endDate,
                status,
                ...others,
            });
            await newSemester.save();
            return newSemester;
        } catch (error) {
            console.error('Error creating Semester:', error);
            throw error;
        }
    };

    static querySemester = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Semesterrname=abc") into a MongoDB query object
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
            const foundSemesters = await Semester.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundSemesters;
        } catch (error) {
            console.error('Error querying Semesters:', error);
            throw error;
        }
    };

    static deleteSemesterById = async ({ id }) => {
        try {
            const found = await Semester.deleteOne({ id });
            console.log('Semester delete: ', found);
            return found;
        } catch (error) {
            console.error('Error delete Semester:', error);
            throw error;
        }
    };

    static closeSemesterById = async ({ id }) => {
        try {
            const found = await Semester.findOne({ id });
            found.status = SemesterStatus.CLOSED;
            await found.save();
            console.log('Semester closed: ', found);
            return found;
        } catch (error) {
            console.error('Error closed Semester:', error);
            throw error;
        }
    };

    static switchSemesterToProcessing = async ({ id }) => {
        try {
            const found = await Semester.findOne({ id });
            found.status = SemesterStatus.PROCESSING;
            await found.save();
            console.log('Semester processing: ', found);
            return found;
        } catch (error) {
            console.error('Error switch Semester status:', error);
            throw error;
        }
    };

    static switchSemesterToActive = async ({ id }) => {
        try {
            const found = await Semester.findOne({ id });
            found.status = SemesterStatus.ACTIVE;
            await found.save();
            console.log('Semester active: ', found);
            return found;
        } catch (error) {
            console.error('Error switch Semester status:', error);
            throw error;
        }
    };

    static openSemesterForRegistration = async ({ id }) => {
        try {
            const found = await Semester.findOne({ id });
            found.status = SemesterStatus.OPEN_FOR_REGISTRATION;
            await found.save();
            console.log('Semester open for registration: ', found);
            return found;
        } catch (error) {
            console.error('Error switch Semester status:', error);
            throw error;
        }
    };

    static findSemesterWithId = async ({ id }) => {
        try {
            const found = await Semester.findOne({ id });
            return found;
        } catch (error) {
            console.error('Error finding Semester:', error);
            throw error;
        }
    };

    static updateSemesterInfor = async ({ id, ...updates }) => {
        try {
            const updatedSemester = await Semester.findOneAndUpdate(
                { id },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedSemester;
        } catch (error) {
            console.error('Error updating Semester:', error);
            throw error;
        }
    };
}
