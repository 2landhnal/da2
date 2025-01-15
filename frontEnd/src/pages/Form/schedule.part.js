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
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import {
    localDateToUtcDatetime,
    localTimeToGlobalTime,
} from '../../utils/dateTime.handler';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Schedule(
    schedules,
    setSchedules,
    semesterData,
    index,
    handleRemoveSchedule,
) {
    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules]; // Tạo bản sao của mảng schedules
            newSchedules[index] = {
                ...newSchedules[index], // Bảo lưu các thuộc tính khác trong schedule tại index
                [name]: value, // Cập nhật giá trị của thuộc tính thay đổi
            };
            return newSchedules; // Trả về mảng đã cập nhật
        });
    };

    // Schedule
    const handleTimeSlotChange = (id, field, value) => {
        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules]; // Tạo bản sao của mảng schedules
            newSchedules[index].timeSlots[id][field] = value;
            return newSchedules; // Trả về mảng đã cập nhật
        });
    };

    const addTimeSlot = () => {
        console.log('add time slot');
        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules]; // Tạo bản sao của mảng schedules
            console.log('Hey'); // dont event get here, but still add 2?
            newSchedules[index].timeSlots.push({
                startAt: '',
                endAt: '',
                allowance: [],
            });
            return newSchedules; // Trả về mảng đã cập nhật
        });
    };

    const removeTimeSlot = (id) => {
        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules]; // Tạo bản sao của mảng schedules
            newSchedules[index].timeSlots = newSchedules[
                index
            ].timeSlots.filter((_, i) => i !== id);
            return newSchedules; // Trả về mảng đã cập nhật
        });
    };
    // end timeSlot

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        await handleAddSchedule();
    };

    const handleAddSchedule = async () => {
        let scheduleData = schedules[index];
        scheduleData = { ...scheduleData, semesterId: semesterData.id };
        //date
        scheduleData.startDate = localDateToUtcDatetime(scheduleData.startDate);
        scheduleData.endDate = localDateToUtcDatetime(scheduleData.endDate);

        // time
        scheduleData.timeSlots = scheduleData.timeSlots.map((t) => {
            t.startAt = localTimeToGlobalTime(t.startAt);
            t.endAt = localTimeToGlobalTime(t.endAt);
            return t;
        });
        console.log(scheduleData);
        let response;
        response = await fetchPost({
            base: semesterUrlSecure,
            path: '/schedule',
            body: scheduleData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            handleRemoveSchedule(index);
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Create failed: ${response.message}`);
        }
    };
    return (
        <form onSubmit={handleScheduleSubmit}>
            <div className={cx('form-group')}>
                <label htmlFor="semesterId" className="required">
                    Mã học kì
                </label>
                <input
                    type="text"
                    id="semesterId"
                    name="semesterId"
                    value={semesterData.id}
                    placeholder="Mã học kì"
                    required
                    readOnly
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
                    onChange={handleScheduleChange}
                    value={schedules[index].startDate}
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
                    onChange={handleScheduleChange}
                    value={schedules[index].endDate}
                    placeholder="Ngày kết thúc"
                    required
                    onSubmit={(e) => e.target.reportValidity()}
                />
            </div>

            {/* Quản lý danh sách lịch học */}
            <div className={cx('form-group')}>
                <div className="flexRow">
                    <label>
                        Khung giờ{' '}
                        <FontAwesomeIcon
                            icon={faPlusCircle}
                            onClick={addTimeSlot}
                            className={cx('add-circle')}
                        />
                    </label>
                </div>
                {schedules[index].timeSlots.map((timeSlot, id) => (
                    <div key={id} className={cx('schedule-item')}>
                        <input
                            type="time"
                            value={timeSlot.startAt}
                            onChange={(e) =>
                                handleTimeSlotChange(
                                    id,
                                    'startAt',
                                    e.target.value,
                                )
                            }
                            required
                        />
                        <input
                            type="time"
                            value={timeSlot.endAt}
                            onChange={(e) =>
                                handleTimeSlotChange(
                                    id,
                                    'endAt',
                                    e.target.value,
                                )
                            }
                            required
                        />
                        <Select
                            value={timeSlot.allowance.map((a) => {
                                return {
                                    value: a,
                                    label: a,
                                };
                            })}
                            onChange={(values) =>
                                handleTimeSlotChange(
                                    id,
                                    'allowance',
                                    values.map((value) => value.value),
                                )
                            }
                            isMulti
                            options={Array.from({ length: 11 }, (_, i) => {
                                return {
                                    value: new Date().getFullYear() - i,
                                    label: new Date().getFullYear() - i,
                                };
                            })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeTimeSlot(id)}
                            className={cx('button', 'delete')}
                        >
                            Xóa
                        </button>
                    </div>
                ))}
            </div>
            <button type="submit" className={cx('button')}>
                Thêm lịch đăng ký
            </button>
        </form>
    );
}

export default Schedule;
