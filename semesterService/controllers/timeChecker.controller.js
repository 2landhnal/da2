import { SemesterService } from '../services/semester.service.js';

export class TimeCheckerController {
    static Check = async ({ repeat = true, checkPeriodInMinute = 1 } = {}) => {
        const executeCheck = async () => {
            try {
                console.log('Running TimeCheckerController.Check...');
                await SemesterService.checkProcessingSemester();
                await SemesterService.checkOpenForRegistrationSemester();
                await SemesterService.checkActiveSemester();
                await SemesterService.checkClosedSemester();
                console.log('TimeCheckerController.Check completed.');
            } catch (error) {
                console.error('Error in TimeCheckerController.Check:', error);
            }
        };

        // Thực hiện lần đầu tiên
        await executeCheck();

        // Nếu cần chạy lặp
        if (repeat) {
            setInterval(async () => {
                await executeCheck();
            }, checkPeriodInMinute * 1000 * 60);
        }
    };
}
