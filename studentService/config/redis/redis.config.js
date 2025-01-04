export const studentKey = {
    key: (uid) => `student:${uid}`,
    expireTimeInMinute: 60,
};

export const studentsKey = {
    key: (page, resultPerPage, query) =>
        `students:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: 60,
};
