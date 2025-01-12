import React, { useEffect, useState } from 'react';
import styles from './Timetable.module.scss';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import SemesterBox from '../../components/SemesterBox';
import { fetchGet } from '../../utils/fetch.utils.js';
import {
    classUrlSecure,
    enrollmentUrl,
    enrollmentUrlSecure,
    semesterUrlSecure,
} from '../../config/index.js';
import { useAuth } from '../../routes/authProvider.route.js';

const cx = classNames.bind(styles);

function TimeTable() {
    const { payload } = useAuth();
    const [semesterLst, setSemesterLst] = useState([]);
    const [semester, setSemester] = useState(null);
    const [_classes, setClasses] = useState([]);
    const [_shifts, setShifts] = useState([]);
    useEffect(() => {
        const fun = async () => {
            try {
                const query = {
                    query: JSON.stringify({}),
                };
                const { metadata } = await fetchGet({
                    base: semesterUrlSecure,
                    path: 'search',
                    query: query,
                });
                console.log({ metadata });
                let { semesters } = metadata;
                semesters = semesters.map((e, index) => {
                    return {
                        ...e,
                        title: e.id,
                        onClick: () => {
                            setSemester(semesters[index]);
                        },
                    };
                });
                console.log({ semesters });
                setSemesterLst(semesters);
                setSemester(semesters[0]);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, []);

    useEffect(() => {
        const fun = async () => {
            try {
                if (!semester) return;
                const { classes } = (
                    await fetchGet({
                        base: enrollmentUrlSecure,
                        path: 'registered',
                        query: {
                            studentId: payload.uid,
                            semesterId: semester.id,
                        },
                    })
                ).metadata;
                console.log(classes);

                // shift
                const query = {
                    query: JSON.stringify({}),
                };
                const { metadata } = await fetchGet({
                    base: classUrlSecure,
                    path: '/shift/search',
                    query: query,
                });
                let { shifts } = metadata;
                console.log({ shifts });
                setShifts(shifts);

                const dict = shifts.reduce((acc, item) => {
                    console.log({ item });
                    const { startAt, endAt } = item;
                    acc[item.id] = { startAt, endAt };
                    return acc;
                }, {});
                console.log(dict);

                setClasses(
                    classes.map((e) => {
                        let translatedSchedule = '';
                        e.schedule.map((s) => {
                            translatedSchedule += `Th${s.dayOfWeek}, từ ${
                                dict[s.startShift].startAt
                            } đến ${dict[s.endShift].endAt}\n`;
                        });
                        console.log(translatedSchedule);
                        e.translatedSchedule = translatedSchedule;
                        return e;
                    }),
                );
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [semester, payload]);

    return (
        <div className={cx('container')}>
            <div className={cx('headerSection')}>
                <h1 className={cx('title')}>Time table</h1>
                <SemesterBox semesterLst={semesterLst} semester={semester} />
            </div>

            <div className={cx('tableContainer')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Mã lớp học</th>
                            <th>Mã môn học</th>
                            <th>Môn học</th>
                            <th>Giảng viên</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_classes.length > 0 &&
                            _classes.map((_class, index) => (
                                <tr key={index}>
                                    <td>{_class?.classId || ''}</td>
                                    <td>{_class?.courseId || ''}</td>
                                    <td>{_class?.courseName || ''}</td>
                                    <td>{_class?.teacherName || ''}</td>
                                    <td>{_class?.translatedSchedule || ''}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TimeTable;
