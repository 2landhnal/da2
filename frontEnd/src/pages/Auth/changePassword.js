import React, { useState } from 'react';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { authUrl, authUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChangePassword = async () => {
        const { currentPassword, newPassword } = formData;
        const response = await fetchPut({
            base: authUrlSecure,
            path: '/changePassword',
            body: { currentPassword, newPassword },
            cookies: true,
        });
        if (response.ok) {
            console.log(response);
            toast.success('Change password success', { autoClose: 3000 });
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Change password failed: ${response.message}`);
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
        if (formData.confirmPassword !== formData.newPassword) {
            toast.error('New password and confirm password not match', {
                autoClose: 3000,
            });
            return;
        }
        await handleChangePassword();
    };

    return (
        <div className={cx('auth-container')}>
            <div className={cx('background')}></div>
            <div className={cx('auth-card')}>
                <h1>Đổi mật khẩu</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="currentPassword">
                            Current password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your current password"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="confirmPassword">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <button type="submit" className={cx('submit-button')}>
                        Change password
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ChangePassword;
