import React, { useState } from 'react';
import styles from './Course.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { fetchGet } from '../../utils/fetch.utils';
import { courseUrl } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { routePath } from '../../routes';

const cx = classNames.bind(styles);

function CourseSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tmp, setTmp] = useState('');
    const [courses, setCourses] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fun = async () => {
            try {
                const query = {
                    page,
                    resultPerPage: 50,
                    keyword: searchTerm,
                };
                const { courses: _courses } = (
                    await fetchGet({
                        base: courseUrl,
                        path: '/search/keyword',
                        query,
                    })
                ).metadata;

                setCourses(_courses);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [searchTerm, page]);

    // // Sample course data
    // const courses = [
    //     { code: 'MI2022', name: 'CTDL&GT', credits: 3 },
    //     { code: 'MI2023', name: 'CTDL&TT', credits: 3 },
    // ];

    const handleInputChange = (value) => {
        setTmp(value);
        // Clear the existing timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            setSearchTerm(tmp); // Update search term after 200ms
        }, 200);
        setDebounceTimeout(timeout);
    };

    return (
        <div className={cx('container')}>
            {/* Search Form */}
            <div className={cx('searchContainer')}>
                <input
                    type="text"
                    value={tmp}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Môn học"
                    className={cx('searchInput')}
                />
                <button className={cx('searchButton')}>Search</button>
            </div>

            {/* Results Table */}
            <div className={cx('tableContainer')}>
                <div className={cx('page-number-container')}>
                    <div
                        className={cx('page-number-arrow-btn')}
                        onClick={() => {
                            setPage((prev) => prev - 1);
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <input
                        type="number"
                        value={page}
                        onChange={(e) => {
                            setPage(e.target.value);
                        }}
                        className={cx('page-number-input')}
                    />
                    <div
                        className={cx('page-number-arrow-btn')}
                        onClick={() => {
                            setPage((prev) => prev + 1);
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                </div>
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
                            <tr
                                key={index}
                                onClick={() => {
                                    navigate(
                                        routePath.updateCourse.split(':')[0] +
                                            `${course.id}`,
                                        { replace: true },
                                    );
                                }}
                            >
                                <td>{course.id}</td>
                                <td>{course.name}</td>
                                <td>{course.credit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CourseSearch;
