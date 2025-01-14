import { useEffect, useState } from 'react';
import styles from './Enroll.module.scss';
import classNames from 'classnames/bind';
import SemesterBox from '../../components/SemesterBox';
import { fetchGet } from '../../utils/fetch.utils';
import { semesterUrl, semesterUrlSecure } from '../../config';

const cx = classNames.bind(styles);

function Enroll() {
    const [classId, setClassId] = useState('');
    const [showError, setShowError] = useState(true);
    const [semesterLst, setSemesterLst] = useState([]);
    const [semester, setSemester] = useState(null);

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
                semesters.forEach((s) => {
                    if (s.status === 'processing') {
                        setSemester(s);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, []);

    useEffect(() => {
        const fun = () => {
            try {
                // const {classes}
            } catch (error) {
                console.log(error);
            }
        };
    }, [semester]);

    // State for registered classes
    const [registeredClasses, setRegisteredClasses] = useState([
        { id: 'MI2023', name: 'CTDL&GT', credit: 2, selected: false },
        { id: 'MI2024', name: 'Toán Rời Rạc', credit: 3, selected: false },
        {
            id: 'MI2025',
            name: 'Lập Trình Hướng Đối Tượng',
            credit: 4,
            selected: false,
        },
        { id: 'MI2026', name: 'Mạng Máy Tính', credit: 3, selected: true },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle enrollment logic here
    };

    const handleCheckboxChange = (index) => {
        setRegisteredClasses((prevClasses) =>
            prevClasses.map((course, idx) =>
                idx === index
                    ? { ...course, selected: !course.selected }
                    : course,
            ),
        );
    };

    return (
        <div className={cx('container')}>
            <div className={cx('headerSection')}>
                <h1 className={cx('title')}>Kì học</h1>
                <SemesterBox semesterLst={semesterLst} semester={semester} />
            </div>
            {/* Enrollment Form */}
            <form onSubmit={handleSubmit} className={cx('enrollForm')}>
                <div className={cx('formGroup')}>
                    <input
                        type="text"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        placeholder="Mã lớp"
                        className={cx('input')}
                    />
                    <button type="submit" className={cx('enrollButton')}>
                        Đăng ký
                    </button>
                </div>
            </form>

            {/* Error Message
            {showError && (
                <div className={cx('errorMessage')}>Lớp học 165389 đã đầy</div>
            )} */}

            {/* Registered Classes */}
            <div className={cx('registeredSection')}>
                <div className={cx('sectionHeader')}>
                    <h2 className={cx('sectionTitle')}>Lớp đã đăng ký</h2>
                    <button className={cx('removeButton')}>Hủy đăng ký</button>
                </div>

                <div className={cx('tableContainer')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã lớp</th>
                                <th>Môn học</th>
                                <th>Số tín chỉ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredClasses.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.id}</td>
                                    <td>{course.name}</td>
                                    <td>{course.credit}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={course.selected}
                                            onChange={() =>
                                                handleCheckboxChange(index)
                                            }
                                            className={cx('checkbox')}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Enroll;
