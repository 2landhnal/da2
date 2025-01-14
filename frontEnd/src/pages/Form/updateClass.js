import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import { authUrl, classUrlSecure, studentUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function UpdateClass() {
    const { id } = useParams();
    const [startAt, setStartAt] = useState([]);
    const [endAt, setEndAt] = useState([]);
    const [formData, setFormData] = useState({
        courseId: '',
        roomId: '',
        teacherId: '',
        semesterId: '',
        maxCapacity: '',
        schedule: [],
        teamCode: '',
    });
    useEffect(() => {
        let fun = async () => {
            const { shifts } = (
                await fetchGet({
                    base: classUrlSecure,
                    path: '/shift/search',
                    query: {
                        query: JSON.stringify({}),
                    },
                })
            ).metadata;
            setStartAt(
                shifts.map((e) => {
                    return {
                        id: e.id,
                        value: e.startAt,
                    };
                }),
            );
            setEndAt(
                shifts.map((e) => {
                    return {
                        id: e.id,
                        value: e.endAt,
                    };
                }),
            );
        };
        fun();

        fun = async () => {
            try {
                const { class: _class } = (
                    await fetchGet({ base: classUrlSecure, path: `/${id}` })
                ).metadata;
                setFormData(_class);
            } catch (error) {
                toast.error(error, { autoClose: 3000 });
            }
        };
        fun();
    }, []);

    const handleUpdateClass = async () => {
        console.log(formData);
        let response;
        response = await fetchPut({
            base: classUrlSecure,
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
        await handleUpdateClass();
    };

    const handleScheduleChange = (index, field, value) => {
        setFormData((prevData) => {
            const newSchedule = [...prevData.schedule];
            newSchedule[index][field] = Number(value);
            console.log({ newSchedule });
            return { ...prevData, schedule: newSchedule };
        });
    };

    const addSchedule = () => {
        setFormData((prevData) => ({
            ...prevData,
            schedule: [
                ...prevData.schedule,
                { startShift: 1, endShift: 1, dayOfWeek: 0 },
            ],
        }));
    };

    const removeSchedule = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            schedule: prevData.schedule.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Cập nhật lớp học</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="semesterId" className="required">
                            Kì học
                        </label>
                        <input
                            type="text"
                            id="semesterId"
                            name="semesterId"
                            onChange={handleInputChange}
                            value={formData.semesterId}
                            placeholder="Kì học"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="courseId" className="required">
                            Mã học phần
                        </label>
                        <input
                            type="text"
                            id="courseId"
                            name="courseId"
                            onChange={handleInputChange}
                            value={formData.courseId}
                            placeholder="Mã học phần"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="roomId" className="required">
                            Phòng học
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            onChange={handleInputChange}
                            value={formData.roomId}
                            placeholder="Phòng học"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="teacherId" className="required">
                            Giảng viên
                        </label>
                        <input
                            type="text"
                            id="teacherId"
                            name="teacherId"
                            onChange={handleInputChange}
                            value={formData.teacherId}
                            placeholder="Giảng viên"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="teamCode">Mã Teams</label>
                        <input
                            type="text"
                            id="teamCode"
                            name="teamCode"
                            onChange={handleInputChange}
                            value={formData.teamCode}
                            placeholder="Mã Teams"
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="maxCapacity" className="required">
                            Số chỗ
                        </label>
                        <input
                            type="number"
                            id="maxCapacity"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleInputChange}
                            onSubmit={(e) => e.target.reportValidity()}
                            placeholder="Số chỗ"
                            required
                        />
                    </div>

                    {/* Quản lý danh sách lịch học */}
                    <div className={cx('form-group')}>
                        <div className="flexRow">
                            <label>Lịch học </label>
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                onClick={addSchedule}
                                className={cx('add-schedule')}
                            />
                        </div>
                        {formData.schedule.map((schedule, index) => (
                            <div key={index} className={cx('schedule-item')}>
                                <select
                                    value={schedule.startShift}
                                    onChange={(e) =>
                                        handleScheduleChange(
                                            index,
                                            'startShift',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    {startAt.map((e) => {
                                        return (
                                            <option
                                                key={Number(e.id)}
                                                value={Number(e.id)}
                                            >
                                                {e.value}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={schedule.endShift}
                                    onChange={(e) =>
                                        handleScheduleChange(
                                            index,
                                            'endShift',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    {endAt.map((e) => {
                                        return (
                                            <option
                                                key={Number(e.id)}
                                                value={Number(e.id)}
                                            >
                                                {e.value}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={schedule.dayOfWeek}
                                    onChange={(e) =>
                                        handleScheduleChange(
                                            index,
                                            'dayOfWeek',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value={0}>Chọn ngày</option>
                                    <option value={2}>Thứ 2</option>
                                    <option value={3}>Thứ 3</option>
                                    <option value={4}>Thứ 4</option>
                                    <option value={5}>Thứ 5</option>
                                    <option value={6}>Thứ 6</option>
                                    <option value={7}>Thứ 7</option>
                                    <option value={8}>Chủ Nhật</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeSchedule(index)}
                                    className={cx('button', 'delete')}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={cx('button')}>
                        Cập nhật
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateClass;
