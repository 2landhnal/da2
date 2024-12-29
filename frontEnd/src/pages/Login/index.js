import React, { useState } from 'react';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { authUrl } from '../../config';
import { routePath } from '../../routes';
import { fetchPost } from '../../utils/fetch.utils';

const cx = classNames.bind(styles);

function Auth() {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleLogin = async () => {
        const email = formData.email;
        const password = formData.password;
        console.log('Login:', {
            email,
            password,
        }); // fine hêre
        let response = await fetchPost(
            authUrl,
            '/login',
            JSON.stringify({ email, password }),
            {},
            true,
        );
        console.log(response);
        localStorage.setItem('accessToken', response.metadata.accessToken);
        navigate(routePath.home, { replace: true });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUp = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        alert('Sign Up:', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginMode) {
            await handleLogin();
        } else {
            handleSignUp();
        }
    };

    const switchMode = () => {
        setIsLoginMode((prevMode) => !prevMode);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };

    return (
        <div className={cx('auth-container')}>
            <div className={cx('auth-card')}>
                <h1>{isLoginMode ? 'Login' : 'Sign Up'}</h1>

                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <div className={cx('form-group')}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required={!isLoginMode}
                            />
                        </div>
                    )}

                    <div className={cx('form-group')}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {!isLoginMode && (
                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required={!isLoginMode}
                            />
                        </div>
                    )}

                    <button type="submit" className={cx('submit-button')}>
                        {isLoginMode ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className={cx('switch-mode')}>
                    <p>
                        {isLoginMode
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={switchMode}
                            className={cx('switch-button')}
                        >
                            {isLoginMode ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;
