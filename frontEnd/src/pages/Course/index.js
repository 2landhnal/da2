import React, { useState } from 'react';
import styles from './Course.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CourseSearch() {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample course data
    const courses = [
        { code: 'MI2022', name: 'CTDL&GT', credits: 3 },
        { code: 'MI2023', name: 'CTDL&TT', credits: 3 },
    ];

    return (
        <div className={cx('container')}>
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
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.credits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CourseSearch;
