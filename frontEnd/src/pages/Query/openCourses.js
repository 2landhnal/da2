import React, { useState } from 'react';
import styles from './Query.module.scss';
import classNames from 'classnames/bind';
import SemesterBox from '../../components/SemesterBox';
import { useEffect } from 'react';
import {
    classUrl,
    courseUrl,
    semesterUrl,
    semesterUrlSecure,
} from '../../config';
import { fetchGet } from '../../utils/fetch.utils';

const cx = classNames.bind(styles);

function OpenCourses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterLst, setSemesterLst] = useState([]);
    const [semester, setSemester] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fun = async () => {
            try {
                const query = {
                    query: JSON.stringify({}),
                };
                const { metadata } = await fetchGet({
                    base: semesterUrl,
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
                semesters = semesters.forEach((s) => {
                    if (s.status === 'openForRegistration') {
                        setSemester(s);
                    }
                });
                setSemesterLst(semesters);
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
                if (!semester.id) return;
                const { metadata } = await fetchGet({
                    base: classUrl,
                    path: `openCourses/semester/${semester.id}`,
                });
                console.log({ metadata });
                let { courses: courseIds } = metadata;

                const query = {
                    page: 1,
                    resultPerPage: 100,
                    query: JSON.stringify({ id: { $in: courseIds } }),
                };
                const { courses: _courses } = (
                    await fetchGet({
                        base: courseUrl,
                        path: '/search',
                        query,
                    })
                ).metadata;

                setCourses(_courses);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [semester]);

    return (
        <div className={cx('container')}>
            <div className={cx('headerSection')}>
                <h1 className={cx('title')}>Time table</h1>
                <SemesterBox semesterLst={semesterLst} semester={semester} />
            </div>
            {/* Search Form */}
            <div className={cx('searchContainer')}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Môn học"
                    className={cx('searchInput')}
                />
                <button className={cx('searchButton')}>Search</button>
            </div>

            {/* Results Table */}
            <div className={cx('tableContainer')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Số tín chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={index}>
                                <td>{course?.id || ''}</td>
                                <td>{course?.name || ''}</td>
                                <td>{course?.credit || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OpenCourses;
