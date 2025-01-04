import React, { useState } from 'react';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { authUrl } from '../../config';
import { routePath } from '../../routes';
import { fetchPost } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleLogin = async () => {
        const email = formData.email;
        const password = formData.password;
        try {
            let response = await fetchPost(
                authUrl,
                '/login',
                JSON.stringify({ email, password }),
                {},
                true,
            );
            console.log(response);
            localStorage.setItem('accessToken', response.metadata.accessToken);
            toast.success('Login success', { autoClose: 3000 });
            navigate(routePath.home, { replace: true });
        } catch (error) {
            toast.error('Invalid information', { autoClose: 3000 });
            console.error(`Login failed: ${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin();
    };

    return (
        <div className={cx('auth-container')}>
            <div className={cx('background')}></div>
            <div className={cx('auth-card')}>
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className={cx('submit-button')}>
                        Login
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
