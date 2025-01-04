import React from 'react';
import styles from './Timetable.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function TimeTable() {
    // Sample data - this could be fetched from an API
    const scheduleData = [
        {
            courseId: 'MI4414',
            classId: '155371',
            courseName: 'Quản trị dự án CNTT',
            teacher: 'Lê Hải Hà',
            time: 'Thứ 3,12h30 - 14h55',
        },
        {
            courseId: 'MI4382',
            classId: '155377',
            courseName: 'Đồ họa máy tính',
            teacher: 'Lê Kim Thư',
            time: 'Thứ 5,12h30 - 15h50',
        },
        {
            courseId: 'MI4374',
            classId: '155377',
            courseName: 'Thiết kế, cài đặt và quản trị mạng',
            teacher: 'Nguyễn Đình Hân',
            time: 'Thứ 5,16h0 - 17h30',
        },
    ];

    return (
        <div className={cx('container')}>
            <div className={cx('headerSection')}>
                <h1 className={cx('title')}>Time table</h1>
                <span className={cx('semester')}>20231</span>
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
                        {scheduleData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.classId}</td>
                                <td>{row.courseId}</td>
                                <td>{row.courseName}</td>
                                <td>{row.teacher}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TimeTable;
