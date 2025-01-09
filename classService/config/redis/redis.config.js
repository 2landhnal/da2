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

export const courseKey = {
    key: (id) => `course:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const coursesKey = {
    key: (page, resultPerPage, query) =>
        `courses:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const coursesInSemesterKey = {
    key: (semesterId) => `coursesInSemester:${semesterId}`,
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

export const shiftKey = {
    key: (id) => `shift:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const shiftsKey = {
    key: (page, resultPerPage, query) =>
        `shifts:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const roomKey = {
    key: (id) => `room:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const roomsKey = {
    key: (page, resultPerPage, query) =>
        `rooms:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};

export const classKey = {
    key: (id) => `class:${id}`,
    expireTimeInMinute: testTime || 60,
};

export const classesKey = {
    key: (page, resultPerPage, query) =>
        `classes:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime || 60,
};
