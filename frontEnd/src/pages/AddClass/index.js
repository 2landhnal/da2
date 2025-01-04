import React, { useState } from 'react';
import styles from './AddClass.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NewClassForm() {
    const [formData, setFormData] = useState({
        courseId: '',
        courseName: '',
        roomId: '',
        teacherId: '',
        teacherName: '',
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Giả lập kiểm tra lỗi trùng lịch
        if (formData.teacherId === '123') {
            setError("Teacher's schedule overlap");
            return;
        }

        setError('');
        console.log('Form submitted:', formData);

        // Reset form (tùy chọn)
        setFormData({
            courseId: '',
            courseName: '',
            roomId: '',
            teacherId: '',
            teacherName: '',
        });
    };

    return (
        <div className={cx('new-class-form')}>
            <div className={cx('header')}>
                <h1 className={cx('title')}>Thêm lớp học</h1>
                <div className={cx('semesterSection')}>
                    <span className={cx('semesterLabel')}>Kì học</span>
                    <span className={cx('semesterValue')}>20231</span>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={cx('form-row')}>
                    <label htmlFor="courseId">Course id</label>
                    <input
                        id="courseId"
                        type="text"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={cx('form-row')}>
                    <label htmlFor="courseName">Course name</label>
                    <input
                        id="courseName"
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={cx('form-row')}>
                    <label htmlFor="roomId">Room id</label>
                    <input
                        id="roomId"
                        type="text"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={cx('form-row')}>
                    <label htmlFor="teacherId">Teacher id</label>
                    <input
                        id="teacherId"
                        type="text"
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={cx('form-row')}>
                    <label htmlFor="teacherName">Teacher name</label>
                    <input
                        id="teacherName"
                        type="text"
                        name="teacherName"
                        value={formData.teacherName}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <div className={cx('error')}>{error}</div>}
                <button type="submit" className={cx('createButton')}>
                    Create
                </button>
            </form>
        </div>
    );
}

export default NewClassForm;
