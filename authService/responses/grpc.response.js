import * as grpc from '@grpc/grpc-js';
export const successGRPC = ({
    message = 'Success',
    code = grpc.status.OK,
    metadata = {},
} = {}) => {
    return {
        response: JSON.stringify({
            ok: true,
            code,
            message,
            metadata,
        }),
    };
};

export const failedGRPC = ({
    code = grpc.status.NOT_FOUND,
    message = 'Failed',
} = {}) => {
    return {
        code,
        message,
    };
};
