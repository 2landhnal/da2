import classNames from 'classnames/bind';
import { post } from './httpRequests.js';
import { authUrl } from '../config/index.js';
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
    return true;
};
