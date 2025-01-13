import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import { authUrl, courseUrl, courseUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function UpdateCourse() {
    const { id } = useParams();
    // const id = 'MI3535';
    const [formData, setFormData] = useState({
        id,
        name: '',
        credit: '',
    });
    const [course, setCourses] = useState({});
    useEffect(() => {
        const fun = async () => {
            try {
                const { course: _course } = (
                    await fetchGet({ base: courseUrl, path: `/${id}` })
                ).metadata;
                setFormData(_course);
                setCourses(_course);
            } catch (error) {
                toast.error(error, { autoClose: 3000 });
            }
        };
        fun();
    }, []);

    const handleClose = async () => {
        alert('Close');
    };

    const handleActive = async () => {
        alert('Active');
    };

    const handleUpdateCourse = async () => {
        console.log(formData);
        let response;
        response = await fetchPut({
            base: courseUrlSecure,
            path: '/',
            body: formData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
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
        await handleUpdateCourse();
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Cập nhật học phần</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="id">Mã học phần</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            placeholder="Mã học phần"
                            readOnly
                            required
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

                    <button type="submit" className={cx('button', 'primary')}>
                        Update
                    </button>
                    {course && course.status === 'active' && (
                        <button
                            type="button"
                            className={cx('button', 'delete')}
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            Close
                        </button>
                    )}
                    {course && course.status === 'close' && (
                        <button
                            type="button"
                            className={cx('button', 'active')}
                            onClick={() => {
                                handleActive();
                            }}
                        >
                            Active
                        </button>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateCourse;
