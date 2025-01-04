import React, { useState } from 'react';
import styles from './RegistrationSchedule.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function RegistrationSchedule() {
    const [schedules, setSchedules] = useState([
        {
            id: 1,
            timeSlots: [
                { time: '00:00 to 05:00', allowed: '2023, 2022' },
                { time: '06:00 to 11:00', allowed: '2023, 2021' },
            ],
        },
        {
            id: 2,
            timeSlots: [
                { time: '12:00 to 17:00', allowed: '2024, 2023' },
                { time: '18:00 to 23:00', allowed: '2022, 2021' },
            ],
        },
    ]);

    const [newSlot, setNewSlot] = useState({
        from: '',
        to: '',
        allowed: '',
    });

    const handleAddTimeSlot = (scheduleId) => {
        if (newSlot.from && newSlot.to && newSlot.allowed) {
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule.id === scheduleId
                        ? {
                              ...schedule,
                              timeSlots: [
                                  ...schedule.timeSlots,
                                  {
                                      time: `${newSlot.from} to ${newSlot.to}`,
                                      allowed: newSlot.allowed,
                                  },
                              ],
                          }
                        : schedule,
                ),
            );
            setNewSlot({ from: '', to: '', allowed: '' });
        }
    };

    const handleDeleteTimeSlot = (scheduleId, index) => {
        setSchedules((prevSchedules) =>
            prevSchedules.map((schedule) =>
                schedule.id === scheduleId
                    ? {
                          ...schedule,
                          timeSlots: schedule.timeSlots.filter(
                              (_, i) => i !== index,
                          ),
                      }
                    : schedule,
            ),
        );
    };

    const handleAddSchedule = () => {
        setSchedules((prevSchedules) => {
            const lastSchedule = prevSchedules[prevSchedules.length - 1];
            const newId = lastSchedule ? lastSchedule.id + 1 : 1;

            return [
                ...prevSchedules,
                {
                    id: newId,
                    timeSlots: lastSchedule ? [...lastSchedule.timeSlots] : [], // Copy timeSlots từ schedule cuối cùng hoặc để trống
                },
            ];
        });
    };

    const handleDeleteSchedule = (id) => {
        setSchedules((prevSchedules) =>
            prevSchedules.filter((_, i) => i !== id),
        );
    };

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1 className={cx('title')}>Quản lý lịch đăng ký</h1>
                <div className={cx('semesterSection')}>
                    <span className={cx('semesterLabel')}>Kì học</span>
                    <span className={cx('semesterValue')}>20231</span>
                </div>
            </div>

            <button onClick={handleAddSchedule} className={cx('newButton')}>
                Thêm đợt đăng ký
            </button>

            {schedules.map((schedule) => (
                <div key={schedule.id} className={cx('schedule')}>
                    <div className={cx('scheduleHeader')}>
                        <h2 className={cx('scheduleTitle')}>
                            Đợt {schedule.id}
                        </h2>
                        <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() =>
                                handleDeleteSchedule(schedule.id - 1)
                            }
                        />
                    </div>

                    <div className={cx('timeSlots')}>
                        <div className={cx('timeSlot')}>
                            <h3 className={cx('slotTime')}>Thời gian</h3>
                            <h3 className={cx('slotAllowed')}>Khóa</h3>
                            <div></div>
                        </div>
                        {schedule.timeSlots.map((slot, index) => (
                            <div key={index} className={cx('timeSlot')}>
                                <div className={cx('slotTime')}>
                                    {slot.time}
                                </div>
                                <div className={cx('slotAllowed')}>
                                    {slot.allowed}
                                </div>
                                <button
                                    className={cx('deleteButton')}
                                    onClick={() =>
                                        handleDeleteTimeSlot(schedule.id, index)
                                    }
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}

                        <div className={cx('newTimeSlot')}>
                            <FontAwesomeIcon
                                icon={faCirclePlus}
                                onClick={() => handleAddTimeSlot(schedule.id)}
                            />
                            <input
                                type="text"
                                placeholder="From"
                                value={newSlot.from}
                                onChange={(e) =>
                                    setNewSlot({
                                        ...newSlot,
                                        from: e.target.value,
                                    })
                                }
                                className={cx('input')}
                            />
                            <input
                                type="text"
                                placeholder="To"
                                value={newSlot.to}
                                onChange={(e) =>
                                    setNewSlot({
                                        ...newSlot,
                                        to: e.target.value,
                                    })
                                }
                                className={cx('input')}
                            />
                            <input
                                type="text"
                                placeholder="Allowed"
                                value={newSlot.allowed}
                                onChange={(e) =>
                                    setNewSlot({
                                        ...newSlot,
                                        allowed: e.target.value,
                                    })
                                }
                                className={cx('input')}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RegistrationSchedule;
