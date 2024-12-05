import classNames from 'classnames/bind';
import { post } from './httpRequests.js';
// import jwt from 'jsonwebtoken';

export function classCombine(names, cx) {
    const classArray = names.split(' '); // Split the input string into an array
    const res = classNames(names, ...classArray.map((name) => cx(name))); // Use spread operator to combine class names
    return res;
}

export const isTokenExpired = (token) =>
    Date.now() >= JSON.parse(atob(token.split('.')[1])).exp * 1000;

export const isAccessTokenExpired = () =>
    Date.now() >=
    JSON.parse(atob(localStorage.getItem('accessToken').split('.')[1])).exp *
        1000;

export const checkCredential = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const prod = false;

    if (!prod) {
        return false;
    }

    if (isTokenExpired(accessToken)) {
        console.log('Access token expired, trying to get a new one');
        try {
            const options = {
                headers: {
                    authorization: `Bearer ${refreshToken}`,
                },
            };
            const response = await post(
                process.env.REACT_APP_AUTH_URL,
                '/refreshAccessToken',
                {},
                options,
            );
            localStorage.setItem('accessToken', response.accessToken);
            console.log('Get new token success');
            return true; // Token refreshed successfully
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false; // Failed to refresh token
        }
    } else {
        console.log('Access token valid');
        return true; // Token is valid
    }
};
