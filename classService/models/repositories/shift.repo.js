import Shift from '../shift.model.js';

export class ShiftRepo {
    static createShift = async (infor) => {
        try {
            const newShift = new Shift(infor);
            await newShift.save();
            return newShift;
        } catch (error) {
            console.error('Error creating shift:', error);
            throw error;
        }
    };

    static queryShift = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Shiftrname=abc") into a MongoDB query object
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
            const foundShifts = await Shift.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundShifts;
        } catch (error) {
            console.error('Error querying shifts:', error);
            throw error;
        }
    };

    static deleteShiftById = async ({ id }) => {
        try {
            const found = await Shift.deleteOne({ id });
            console.log('Shift delete: ', found);
            return found;
        } catch (error) {
            console.error('Error delete shift:', error);
            throw error;
        }
    };

    static findShiftById = async ({ id }) => {
        try {
            const found = await Shift.findOne({ id });
            return found;
        } catch (error) {
            console.error('Error finding shift:', error);
            throw error;
        }
    };

    static updateShiftInfor = async ({ id, ...updates }) => {
        try {
            const updatedShift = await Shift.findOneAndUpdate(
                { id },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedShift;
        } catch (error) {
            console.error('Error updating shift:', error);
            throw error;
        }
    };
}
