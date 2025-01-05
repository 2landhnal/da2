export const requestHandler = (promise) => {
    return promise
        .then((data) => [undefined, data])
        .catch((error) => [error, undefined]);
};
