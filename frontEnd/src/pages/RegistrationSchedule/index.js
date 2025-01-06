import React, { useState } from 'react';
import styles from './RegistrationSchedule.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import SemesterBox from '../../components/SemesterBox';
import MultiSelectBox from '../../components/MultiSelectBox';
import TimeSlot from './TimeSlot';

const cx = classNames.bind(styles);

function RegistrationSchedule() {
    let semesterLst = [
        {
            title: 20221,
        },
        {
            title: 20222,
        },
        {
            title: 20223,
        },
    ];
    const kList = [
        {
            title: 2021,
        },
        {
            title: 2022,
        },
        {
            title: 2023,
        },
    ];
    semesterLst = semesterLst.map((e, index) => {
        return {
            ...e,
            onClick: () => {
                setSemester(semesterLst[index]);
            },
        };
    });
    const [semester, setSemester] = useState(semesterLst[0]);
    const [schedules, setSchedules] = useState([
        {
            id: 1,
            timeSlots: [
                { time: '00:00 to 05:00', allowed: [2023, 2021] },
                { time: '06:00 to 11:00', allowed: [2023, 2021] },
            ],
        },
        {
            id: 2,
            timeSlots: [
                { time: '12:00 to 17:00', allowed: [2023, 2021] },
                { time: '18:00 to 23:00', allowed: [2023, 2021] },
            ],
        },
    ]);

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
                    <SemesterBox
                        semesterLst={semesterLst}
                        semester={semester}
                    />
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
                                    {slot.allowed.join(', ')}
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
                        <TimeSlot
                            setSchedules={setSchedules}
                            schedule={schedule}
                            kList={kList}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RegistrationSchedule;
