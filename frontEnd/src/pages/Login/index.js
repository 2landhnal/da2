import React, { useState } from 'react';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoginMode) {
            console.log('Login:', {
                email: formData.email,
                password: formData.password,
            });
        } else {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords don't match!");
                return;
            }
            console.log('Sign Up:', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
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
        <div className={cx("auth-container")}>
            <div className={cx("auth-card")}>
                <h1>{isLoginMode ? 'Login' : 'Sign Up'}</h1>

                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <div className={cx("form-group")}>
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

                    <div className={cx("form-group")}>
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

                    <div className={cx("form-group")}>
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
                        <div className={cx("form-group")}>
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

                    <button type="submit" className={cx("submit-button")}>
                        {isLoginMode ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className={cx("switch-mode")}>
                    <p>
                        {isLoginMode
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={switchMode}
                            className={cx("switch-button")}
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
