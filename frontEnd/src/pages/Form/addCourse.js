import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import { authUrl, courseUrlSecure, studentUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function AddCourse() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        credit: '',
    });
    useEffect(() => {
        const fun = async () => {};
        fun();
    }, []);

    const handleAddCourse = async () => {
        console.log(formData);
        let response;
        response = await fetchPost({
            base: courseUrlSecure,
            path: '/',
            body: formData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            setFormData({ id: '', name: '', credit: '' });
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
        await handleAddCourse();
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Thêm học phần</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="id">Mã học phần</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            onChange={handleInputChange}
                            value={formData.id}
                            placeholder="Mã học phần"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="name">Tên học phần</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                            value={formData.name}
                            placeholder="Tên học phần"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="credit">Số tin chỉ</label>
                        <input
                            type="number"
                            id="credit"
                            name="credit"
                            value={formData.credit}
                            onChange={handleInputChange}
                            onSubmit={(e) => e.target.reportValidity()}
                            placeholder="Số tin chỉ"
                            required
                        />
                    </div>

                    <button type="submit" className={cx('button')}>
                        Thêm học phần
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AddCourse;
