import axios from 'axios';

const request = (baseURL: string) =>
    axios.create({
        baseURL,
    });

type RequestOptions = {
    headers?: Record<string, string>;
    params?: Record<string, any>;
};

// GET request
export const get = async (
    baseURL: string,
    path: string,
    options: RequestOptions = {},
) => {
    try {
        const response = await request(baseURL).get(path, {
            headers: options.headers || {}, // Include custom headers if provided
            params: options.params || {}, // Include query parameters if provided
        });
        return response.data;
    } catch (error) {
        console.error(`GET request failed: ${error}`);
        throw error; // Propagate error for further handling if needed
    }
};

// POST request
export const post = async (
    baseURL: string,
    path: string,
    body: any = {},
    options: RequestOptions = {},
) => {
    try {
        const response = await request(baseURL).post(path, body, {
            headers: options.headers || {}, // Include custom headers if provided
        });
        return response.data;
    } catch (error) {
        console.error(`POST request failed: ${error}`);
        throw error; // Propagate error for further handling if needed
    }
};

// DELETE request
export const del = async (
    baseURL: string,
    path: string,
    options: RequestOptions = {},
) => {
    try {
        const response = await request(baseURL).delete(path, {
            headers: options.headers || {}, // Include custom headers if provided
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request failed: ${error}`);
        throw error; // Propagate error for further handling if needed
    }
};

export default request;
