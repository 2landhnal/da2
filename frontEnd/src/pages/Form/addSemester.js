import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import {
    authUrl,
    courseUrlSecure,
    semesterUrlSecure,
    studentUrlSecure,
} from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleMinus,
    faPlusCircle,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import {
    localDateToUtcDatetime,
    localTimeToGlobalTime,
} from '../../utils/dateTime.handler';
import Schedule from './schedule.part';

const cx = classNames.bind(styles);

function AddSemester() {
    const [semesterData, setSemesterData] = useState({
        id: '',
        startDate: '',
        endDate: '',
    });

    const [schedules, setSchedules] = useState([]);
    useEffect(() => {
        console.log({ schedules });
    }, [schedules]);

    const handleAddSemester = async () => {
        console.log({ semesterData });
        semesterData.startDate = localDateToUtcDatetime(semesterData.startDate);
        semesterData.endDate = localDateToUtcDatetime(semesterData.endDate);
        let response;
        response = await fetchPost({
            base: semesterUrlSecure,
            path: '/',
            body: semesterData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            setSemesterData({ id: '', startDate: '', endDate: '' });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Create failed: ${response.message}`);
        }
    };

    const handleSemesterChange = (e) => {
        const { name, value } = e.target;
        setSemesterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSemesterSubmit = async (e) => {
        e.preventDefault();
        await handleAddSemester();
    };

    const handleAddSchedule = () => {
        setSchedules((prev) => [
            ...prev,
            { startDate: '', endDate: '', timeSlots: [] },
        ]);
    };

    const handleRemoveSchedule = (id) => {
        setSchedules((prevSchedules) => {
            let newSchedules = [...prevSchedules]; // Tạo bản sao của mảng schedules
            newSchedules = newSchedules.filter((e, index) => index !== id);
            return newSchedules; // Trả về mảng đã cập nhật
        });
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Học kì</h1>

                <form onSubmit={handleSemesterSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="id" className="required">
                            Mã học kì
                        </label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            onChange={handleSemesterChange}
                            value={semesterData.id}
                            placeholder="Mã học kì"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="startDate" className="required">
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            onChange={handleSemesterChange}
                            value={semesterData.startDate}
                            placeholder="Ngày bắt đầu"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="endDate" className="required">
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            onChange={handleSemesterChange}
                            value={semesterData.endDate}
                            placeholder="Ngày kết thúc"
                            required
                            onSubmit={(e) => e.target.reportValidity()}
                        />
                    </div>

                    <button type="submit" className={cx('button')}>
                        Thêm học kì
                    </button>
                </form>
            </div>

            {/* Schedule */}
            <div className={cx('card')}>
                <h1>
                    Lịch đăng ký
                    <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={handleAddSchedule}
                        className={cx('add-circle')}
                    />
                </h1>
                <div className={cx('schedules-container')}>
                    {schedules.map((schedule, index) => {
                        return (
                            <div className={cx('schedule-container')}>
                                <FontAwesomeIcon
                                    icon={faCircleMinus}
                                    className={cx('schedule-remove')}
                                    onClick={() => {
                                        handleRemoveSchedule(index);
                                    }}
                                />
                                {Schedule(
                                    schedules,
                                    setSchedules,
                                    semesterData,
                                    index,
                                    handleRemoveSchedule,
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AddSemester;
