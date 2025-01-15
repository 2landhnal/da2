import { useEffect, useState } from 'react';
import styles from './Enroll.module.scss';
import classNames from 'classnames/bind';
import SemesterBox from '../../components/SemesterBox';
import { fetchGet, fetchPost, fetchPut } from '../../utils/fetch.utils';
import {
    enrollmentUrl,
    enrollmentUrlSecure,
    semesterUrl,
    semesterUrlSecure,
} from '../../config';
import { useAuth } from '../../routes/authProvider.route';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function Enroll() {
    const { payload } = useAuth();
    const [classId, setClassId] = useState('');
    const [showError, setShowError] = useState(true);
    const [semesterLst, setSemesterLst] = useState([]);
    const [semester, setSemester] = useState(null);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fun = async () => {
            try {
                const { metadata } = await fetchGet({
                    base: semesterUrlSecure,
                    path: `schedule/checkAccess/${payload.uid.substring(0, 4)}`,
                });
                console.log({ metadata });
                let { accessible, semesterIds } = metadata;
                semesterIds = semesterIds.map((e, index) => {
                    return {
                        title: e,
                        onClick: () => {
                            setSemester(semesterIds[index]);
                        },
                    };
                });
                console.log({ semesterIds });
                setSemesterLst(semesterIds);
                if (semesterIds.length > 0) {
                    setSemester(semesterIds[0]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [payload]);

    useEffect(() => {
        const fun = async () => {
            try {
                const query = {
                    studentId: payload.uid,
                    semesterId: semester.title,
                };
                let { classes: _classes } = (
                    await fetchGet({
                        base: enrollmentUrlSecure,
                        path: '/registered',
                        query,
                    })
                ).metadata;
                console.log({ _classes });
                _classes = _classes.map((c) => {
                    return {
                        ...c,
                        selected: false,
                    };
                });
                setClasses(_classes);
            } catch (error) {
                console.log(error);
            }
        };

        fun();
    }, [semester]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchPost({
            base: enrollmentUrlSecure,
            path: '/',
            body: {
                studentId: payload.uid,
                classId,
            },
        });

        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            setSemester((prev) => {
                const tmp = prev;
                return tmp;
            });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Unenroll failed: ${response.message}`);
        }
        // Handle enrollment logic here
    };

    const handleRemove = async () => {
        let selected = classes.filter((e) => e.selected);
        selected = selected.map((e) => e.classId);
        const response = await fetchPut({
            base: enrollmentUrlSecure,
            path: '/delete',
            body: { studentId: payload.uid, classIds: selected },
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            setClasses((prev) => {
                const tmp = prev;
                return tmp.filter((e) => !selected.includes(e.classId));
            });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Unenroll failed: ${response.message}`);
        }
    };

    const handleCheckboxChange = (index) => {
        setClasses((prevClasses) =>
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
                    <button
                        className={cx('removeButton')}
                        onClick={handleRemove}
                    >
                        Hủy đăng ký
                    </button>
                </div>

                <div className={cx('tableContainer')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã lớp</th>
                                <th>Mã học phần</th>
                                <th>Học phần</th>
                                <th>Số tín chỉ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.classId}</td>
                                    <td>{course.courseId}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.courseCredit}</td>
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
            <ToastContainer />
        </div>
    );
}

export default Enroll;
