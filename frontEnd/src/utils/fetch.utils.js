import { CONTENT_TYPE_VALUE } from '../config/header';
import { joinUrl } from './helper';

export const fetchAPI = async (url, options = {}) => {
    try {
        let response = await fetch(url, options);
        const { ok } = response;
        response = await response.json();
        return { ok, ...response };
    } catch (error) {
        console.log(error);
        return { ok: false, message: error };
    }
};

export const fetchGet = async ({
    base,
    path,
    options = {},
    query = null,
    token = true,
    cookies = false,
    contentType = CONTENT_TYPE_VALUE.default,
}) => {
    try {
        options.headers = options.headers || {};
        if (token) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            };
        }
        if (contentType) {
            options.headers = {
                ...options.headers,
                'Content-Type': contentType,
            };
        }
        if (token) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            };
        }
        if (query) {
            path = path + '?' + new URLSearchParams(query);
        }
        console.log(path);
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'GET',
            headers: {
                ...options.headers,
            },
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.log(error);
        return { ok: false, message: error };
    }
};

export const fetchPost = async ({
    base,
    path,
    body = {},
    options = {},
    token = true,
    cookies = false,
    contentType = CONTENT_TYPE_VALUE.default,
}) => {
    try {
        options.headers = options.headers || {};
        if (token) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            };
        }
        if (contentType) {
            options.headers = {
                ...options.headers,
                'Content-Type': contentType,
            };
        }
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'POST',
            headers: {
                ...options.headers,
            },
            body: contentType ? JSON.stringify(body) : body,
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.log(error);
        return { ok: false, message: error };
    }
};

export const fetchPut = async ({
    base,
    path,
    body = {},
    options = {},
    token = true,
    cookies = false,
    contentType = CONTENT_TYPE_VALUE.default,
}) => {
    try {
        options.headers = options.headers || {};
        if (token) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            };
        }
        if (contentType) {
            options.headers = {
                ...options.headers,
                'Content-Type': contentType,
            };
        }
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'PUT',
            headers: {
                ...options.headers,
            },
            body: contentType ? JSON.stringify(body) : body,
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.log(error);
        return { ok: false, message: error };
    }
};

export const fetchDelete = async ({
    base,
    path,
    options = {},
    token = true,
    cookies = false,
    contentType = CONTENT_TYPE_VALUE.default,
}) => {
    try {
        options.headers = options.headers || {};
        if (token) {
            options.headers = {
                ...options.headers,
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            };
        }
        if (contentType) {
            options.headers = {
                ...options.headers,
                'Content-Type': contentType,
            };
        }
        const response = await fetchAPI(joinUrl(base, path), {
            method: 'DELETE',
            headers: {
                ...options.headers,
            },
            credentials: cookies ? 'include' : 'omit',
        });
        return response;
    } catch (error) {
        console.log(error);
        return { ok: false, message: error };
    }
};

const optionWithAccessToken = ({
    otherHeaders = {},
    otherOptions = {},
} = {}) => {
    return {
        ...otherOptions,
        headers: {
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            ...otherHeaders,
        },
    };
};
