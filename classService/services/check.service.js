import { ClassRepo } from '../models/repositories/class.repo.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';

export class CheckService {
    static checkRoomOverlap = async ({ roomId, schedule, classId = null }) => {
        // Fetch all classes with the same roomId
        let classesInRoom = await ClassRepo.findClassByRoomId({
            roomId,
        });
        classesInRoom = classesInRoom.filter((e) => e.id !== classId);

        // Loop through the schedule of the new class
        for (const newSchedule of schedule) {
            const {
                startShift: newStartShift,
                endShift: newEndShift,
                dayOfWeek: newDayOfWeek,
            } = newSchedule;

            // Check against each existing class in the same room
            for (const existingClass of classesInRoom) {
                for (const existingSchedule of existingClass.schedule) {
                    const {
                        startShift: existingStartShift,
                        endShift: existingEndShift,
                        dayOfWeek: existingDayOfWeek,
                    } = existingSchedule;

                    // Check if the days overlap
                    if (newDayOfWeek === existingDayOfWeek) {
                        // Check if the time overlaps
                        if (
                            (newStartShift <= existingEndShift &&
                                newStartShift >= existingStartShift) ||
                            (newEndShift <= existingEndShift &&
                                newEndShift >= existingStartShift) ||
                            (newEndShift >= existingEndShift &&
                                newStartShift <= existingStartShift)
                        ) {
                            throw new BadRequestError(
                                `Schedule conflict: Room ${roomId} is already booked on day ${newDayOfWeek} from shift ${existingStartShift} to shift ${existingEndShift}.`,
                            );
                        }
                    }
                }
            }
        }
    };

    static checkTeacherOverlap = async ({
        teacherId,
        schedule,
        classId = null,
    }) => {
        // Fetch all classes with the same roomId
        let classes = await ClassRepo.findClassByTeacherId({
            teacherId,
        });
        classes = classes.filter((e) => e.id !== classId);

        // Loop through the schedule of the new class
        for (const newSchedule of schedule) {
            const {
                startShift: newStartShift,
                endShift: newEndShift,
                dayOfWeek: newDayOfWeek,
            } = newSchedule;

            // Check against each existing class in the same room
            for (const existingClass of classes) {
                for (const existingSchedule of existingClass.schedule) {
                    const {
                        startShift: existingStartShift,
                        endShift: existingEndShift,
                        dayOfWeek: existingDayOfWeek,
                    } = existingSchedule;

                    // Check if the days overlap
                    if (newDayOfWeek === existingDayOfWeek) {
                        // Check if the time overlaps
                        if (
                            (newStartShift <= existingEndShift &&
                                newStartShift >= existingStartShift) ||
                            (newEndShift <= existingEndShift &&
                                newEndShift >= existingStartShift) ||
                            (newEndShift >= existingEndShift &&
                                newStartShift <= existingStartShift)
                        ) {
                            throw new BadRequestError(
                                `Schedule conflict: Teacher ${teacherId} is already teached on day ${newDayOfWeek} from shift ${existingStartShift} to shift ${existingEndShift}.`,
                            );
                        }
                    }
                }
            }
        }
    };
}
