export const successGRPC = ({ message = 'Success', metadata = {} } = {}) => {
    return {
        ok: true,
        message,
        metadata,
    };
};

export const failedGRPC = ({ message = 'Failed' } = {}) => {
    return {
        ok: false,
        message,
    };
};
