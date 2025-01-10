import { EnrollmentRepo } from '../models/repositories/enrollment.repo.js';
import { BadRequestError } from '../responses/error.response.js';

export class CheckService {
    static checkStudentScheduleOverlap = async ({
        studentId,
        semesterId,
        schedule,
    }) => {
        // Fetch all classes with the same roomId
        let enrollments = await EnrollmentRepo.getRegisteredClass({
            studentId,
            semesterId,
        });

        // Loop through the schedule of the new class
        for (const newSchedule of schedule) {
            const {
                startShift: newStartShift,
                endShift: newEndShift,
                dayOfWeek: newDayOfWeek,
            } = newSchedule;

            // Check against each existing class in the same room
            for (const existingEnrollment of enrollments) {
                for (const existingSchedule of existingEnrollment.schedule) {
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
                                `Schedule conflict: Class ${existingEnrollment.classId} is already registered on day ${newDayOfWeek} from shift ${existingStartShift} to shift ${existingEndShift}.`,
                            );
                        }
                    }
                }
            }
        }
    };
}
