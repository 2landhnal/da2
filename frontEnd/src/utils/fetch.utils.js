import { joinUrl } from './helper';

export const fetchAPI = async (url, options = {}) => {
    let response = await fetch(url, options);

    // Kiểm tra nếu response không thành công (status code >= 400)
    if (!response.ok) {
        response = await response.json();
        const error = new Error(
            response.message || `HTTP error! Status: ${response.status}`,
        );
        error.status = response.status; // Thêm status vào error
        throw error;
    }

    // Nếu response có JSON, tự động parse
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }

    // Trả về response text nếu không phải JSON
    return await response.text();
};

export const fetchGet = async (base, path, options = {}, cookies = false) => {
    try {
        options.headers = options.headers || {};
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'GET',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json', // Add this line
            },
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchPost = async (
    base,
    path,
    body = {},
    options = {},
    cookies = false,
) => {
    try {
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json', // Add this line
            },
            body,
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.error(`POST request failed: ${error}`);
        throw error;
    }
};

export const fetchPut = async (
    base,
    path,
    body = {},
    options = {},
    cookies = false,
) => {
    try {
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'PUT',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json', // Add this line
            },
            body,
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.error(`PUT request failed: ${error}`);
        throw error;
    }
};

export const fetchDelete = async (
    base,
    path,
    options = {},
    cookies = false,
) => {
    try {
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'DELETE',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json', // Add this line
            },
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.error(`DELETE request failed: ${error}`);
        throw error;
    }
};

export const optionWithAccessToken = ({
    otherHeaders = {},
    otherOptions = {},
}) => {
    return {
        ...otherOptions,
        headers: {
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            ...otherHeaders,
        },
    };
};
