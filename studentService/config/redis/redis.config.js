import dotenv from 'dotenv';

dotenv.config();

const testTime = process.env.nodeEnv === 'dev' ? 0.5 : null;

export const studentKey = {
    key: (uid) => `student:${uid}`,
    expireTimeInMinute: testTime || 60,
};

export const studentsKey = {
    key: (page, resultPerPage, query) =>
        `students:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const numberOfStudentWithYoaKey = {
    key: (yoa) => `numberOfStudentWithYoa:${yoa}`,
    expireTimeInMinute: testTime || 60,
};

export const courseKey = {
    key: (id) => `course:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const coursesKey = {
    key: (page, resultPerPage, query) =>
        `courses:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const semesterKey = {
    key: (id) => `semester:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const semestersKey = {
    key: (page, resultPerPage, query) =>
        `semesters:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const registrationScheduleKey = {
    key: (id) => `registrationSchedule:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const registrationSchedulesKey = {
    key: (page, resultPerPage, query) =>
        `registrationSchedules:${page}:${resultPerPage}:${JSON.stringify(
            query,
        )}`,
    expireTimeInMinute: testTime || 60,
};
