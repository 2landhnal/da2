import React, { useState } from 'react';
import styles from './UpdateInformation.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { authUrl, studentUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function UpdateInfor() {
    const { payload } = useAuth();
    const [formData, setFormData] = useState({
        fullname: '',
        personalEmail: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
    });
    useEffect(() => {
        const getInfor = async () => {
            const response = await fetchGet({
                base: studentUrlSecure,
                path: `${payload.uid}`,
                cookies: false,
            });
            if (!response.ok) {
                toast.error(response.message || 'Invalid information', {
                    autoClose: 3000,
                });
                console.error(
                    `Load user information failed: ${response.message}`,
                );
            } else {
                console.log({ response });
                if (
                    response &&
                    response.metadata &&
                    response.metadata.student
                ) {
                    let { dob } = response.metadata.student;
                    response.metadata.student.dob = new Date(dob)
                        .toISOString()
                        .split('T')[0];
                    setFormData({ dob, ...response.metadata.student });
                }
            }
        };
        getInfor();
    }, []);

    const handleUpdateInfor = async () => {
        console.log(formData);
        let response;
        response = await fetchPut({
            base: studentUrlSecure,
            path: '/',
            body: formData,
        });
        console.log(response);
        if (response.ok) {
            localStorage.setItem('accessToken', response.metadata.accessToken);
            toast.success('Update infor success', { autoClose: 3000 });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Update infor failed: ${response.message}`);
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
        await handleUpdateInfor();
    };

    return (
        <div className={cx('auth-container')}>
            <div className={cx('auth-card')}>
                <h1>Cập nhật thông tin</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="uid">Mã số sinh viên</label>
                        <input
                            type="text"
                            id="uid"
                            name="uid"
                            value={formData.uid}
                            placeholder="UID"
                            readOnly
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            placeholder="Email"
                            readOnly
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="fullname">Họ và tên</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            placeholder="Enter your fullname"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="dob">Ngày sinh</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            placeholder="Enter your day of birth"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            placeholder="Enter your address"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="personalEmail">Email cá nhân</label>
                        <input
                            type="email"
                            id="personalEmail"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            placeholder="Enter your personal email"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="gender">Giới tính</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            onBlur={(e) => e.target.reportValidity()}
                            required
                        >
                            <option value="" disabled>
                                -- Chọn giới tính --
                            </option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>

                    <button type="submit" className={cx('submit-button')}>
                        Update
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateInfor;
