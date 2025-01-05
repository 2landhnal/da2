const testTime = 0.5;
export const studentKey = {
    key: (uid) => `student:${uid}`,
    expireTimeInMinute: testTime | 60,
};

export const studentsKey = {
    key: (page, resultPerPage, query) =>
        `students:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime | 60,
};

export const courseKey = {
    key: (id) => `course:${id}`,
    expireTimeInMinute: testTime | 60,
};

export const coursesKey = {
    key: (page, resultPerPage, query) =>
        `courses:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: testTime | 60,
};
