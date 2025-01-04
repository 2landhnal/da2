export const studentKey = {
    key: (uid) => `student:${uid}`,
    expireTimeInMinute: 0.5,
};

export const studentsKey = {
    key: (page, resultPerPage, query) =>
        `students:${page}:${resultPerPage}:${JSON.stringify(query)}`,
    expireTimeInMinute: 0.5,
};
