import axios from 'axios';

const request = (baseURL) =>
    axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json', // Set default headers here if needed
        },
    });
// GET request
export const get = async (baseURL, path, options = {}) => {
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
export const post = async (baseURL, path, body = {}, options = {}) => {
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

// PUT request
export const put = async (baseURL, path, body = {}, options = {}) => {
    try {
        const response = await request(baseURL).put(path, body, {
            headers: options.headers || {}, // Include custom headers if provided
        });
        return response.data;
    } catch (error) {
        console.error(`PUT request failed: ${error}`);
        throw error; // Propagate error for further handling if needed
    }
};

// DELETE request
export const del = async (baseURL, path, options = {}) => {
    try {
        const response = await request(baseURL).delete(path, {
            headers: options.headers || {}, // Include custom headers if provided
            params: options.params || {}, // Include query parameters if provided
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request failed: ${error}`);
        throw error; // Propagate error for further handling if needed
    }
};

export default request;
