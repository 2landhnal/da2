import { RoomStatus } from '../../utils/roomStatus.js';
import Room from '../room.model.js';

export class RoomRepo {
    static createRoom = async (infor) => {
        try {
            const newRoom = new Room(infor);
            await newRoom.save();
            return newRoom;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    };

    static queryRoom = async ({ page, resultPerPage, query }) => {
        try {
            // Skip calculation for pagination
            const skip = (page - 1) * resultPerPage;

            // Parse the query string (e.g., "Roomrname=abc") into a MongoDB query object
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
            const foundRooms = await Room.find(queryObject)
                .skip(skip)
                .limit(resultPerPage);

            // Return paginated results and metadata
            return foundRooms;
        } catch (error) {
            console.error('Error querying rooms:', error);
            throw error;
        }
    };

    static closeRoomById = async ({ id }) => {
        try {
            const found = await Room.findOne({ id });
            found.status = RoomStatus.CLOSED;
            await found.save();
            return found;
        } catch (error) {
            console.error('Error closing Room:', error);
            throw error;
        }
    };

    static activeRoomById = async ({ id }) => {
        try {
            const found = await Room.findOne({ id });
            found.status = RoomStatus.ACTIVE;
            await found.save();
            return found;
        } catch (error) {
            console.error('Error activating Room:', error);
            throw error;
        }
    };

    static findRoomById = async ({ id }) => {
        try {
            const found = await Room.findOne({ id });
            return found;
        } catch (error) {
            console.error('Error finding Room:', error);
            throw error;
        }
    };

    static updateRoomInfor = async ({ id, ...updates }) => {
        try {
            const updatedRoom = await Room.findOneAndUpdate(
                { id },
                { $set: updates },
                { new: true }, // Return the updated document
            );
            return updatedRoom;
        } catch (error) {
            console.error('Error updating Room:', error);
            throw error;
        }
    };
}
