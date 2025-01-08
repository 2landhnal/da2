import Schedule from '../schedule.model.js';

export class ScheduleRepo {
    static createSchedule = async ({
        id,
        semesterId,
        startDate,
        endDate,
        timeSlots,
    }) => {
        try {
            const newSchedule = new Schedule({
                id,
                semesterId,
                startDate,
                endDate,
                timeSlots,
            });
            await newSchedule.save();
            return newSchedule;
        } catch (error) {
            console.error('Error creating Schedule:', error);
            throw error;
        }
    };

    static querySchedule = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Schedulername=abc") into a MongoDB query object
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
            const foundSchedules = await Schedule.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundSchedules;
        } catch (error) {
            console.error('Error querying Schedules:', error);
            throw error;
        }
    };

    static findScheduleWithId = async ({ _id }) => {
        try {
            const found = await Schedule.findOne({ _id });
            return found;
        } catch (error) {
            console.error('Error finding Schedule:', error);
            throw error;
        }
    };

    static findScheduleWithSemesterId = async ({ semesterId }) => {
        try {
            const founds = await Schedule.find({ semesterId });
            return founds;
        } catch (error) {
            console.error('Error finding Schedule:', error);
            throw error;
        }
    };

    static countScheduleWithSemesterId = async ({ semesterId }) => {
        try {
            const count = await Schedule.countDocuments({ semesterId });
            return count;
        } catch (error) {
            console.error('Error counting schedule:', error);
            throw error;
        }
    };

    static findAvailableSchedules = async () => {
        try {
            const now = new Date(); // UTC mặc định trong JavaScript

            // Truy vấn các schedules hợp lệ
            const schedules = await Schedule.find({
                startDate: { $lte: now },
                endDate: { $gte: now },
            });

            return schedules;
        } catch (error) {
            console.error('Error finding Schedule:', error);
            throw error;
        }
    };

    static updateScheduleInfor = async ({
        _id,
        startDate,
        endDate,
        timeSlots,
    }) => {
        try {
            const updates = { startDate, endDate, timeSlots };
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { _id },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedSchedule;
        } catch (error) {
            console.error('Error updating Schedule:', error);
            throw error;
        }
    };
}
