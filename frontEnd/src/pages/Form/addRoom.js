import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import {
    authUrl,
    classUrlSecure,
    courseUrlSecure,
    studentUrlSecure,
} from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function AddRoom() {
    const [formData, setFormData] = useState({
        id: '',
        maxCapacity: '',
    });
    useEffect(() => {
        const fun = async () => {};
        fun();
    }, []);

    const handleAddRoom = async () => {
        console.log(formData);
        let response;
        response = await fetchPost({
            base: classUrlSecure,
            path: '/room',
            body: formData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            setFormData({ id: '', maxCapacity: '' });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Add room failed: ${response.message}`);
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
        await handleAddRoom();
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Thêm phòng học</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="id">Mã phòng học</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            onChange={handleInputChange}
                            value={formData.id}
                            placeholder="Mã phòng học"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="maxCapacity">Sức chứa tối đa</label>
                        <input
                            type="number"
                            id="maxCapacity"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleInputChange}
                            onSubmit={(e) => e.target.reportValidity()}
                            placeholder="Sức chứa tối đa"
                            required
                        />
                    </div>

                    <button type="submit" className={cx('button')}>
                        Thêm phòng học
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AddRoom;
