import classNames from 'classnames/bind';
import { authUrl } from '../config/index.js';
import urlJoin from 'url-join';
import { fetchGet, fetchPost } from './fetch.utils.js';

export const joinUrl = (base, path) => {
    return urlJoin(base, path);
};

export function classCombine(names, cx) {
    const classArray = names.split(' '); // Split the input string into an array
    const res = classNames(names, ...classArray.map((name) => cx(name))); // Use spread operator to combine class names
    return res;
}

export const isTokenExpired = (token) => {
    try {
        const expried =
            Date.now() >= JSON.parse(atob(token.split('.')[1])).exp * 1000;
        return expried;
    } catch (error) {
        console.log(error);
        return true;
    }
};

export const checkCredential = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (
        !accessToken ||
        accessToken === 'null' ||
        accessToken === 'undefined' ||
        isTokenExpired(accessToken)
    ) {
        console.log('Access token expired, trying to get a new one');
        try {
            let response = await fetchGet({
                base: authUrl,
                path: 'refreshAccessToken',
                cookies: true,
            });
            console.log(response);
            if (response.metadata.accessToken) {
                localStorage.setItem(
                    'accessToken',
                    response.metadata.accessToken,
                );
                console.log('Get new token success');
                return true; // Token refreshed successfully
            }
            console.log('Get new token failed');
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false; // Failed to refresh token
        }
    }
    return true;
};
