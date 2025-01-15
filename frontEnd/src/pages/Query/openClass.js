import React, { useState } from 'react';
import styles from './Query.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { fetchGet } from '../../utils/fetch.utils';
import { classUrl, classUrlSecure, semesterUrlSecure } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { routePath } from '../../routes';
import { RoleCode } from '../../config/roleCode';
import { useAuth } from '../../routes/authProvider.route';
import DropDown from '../../components/DropDown';
import SemesterBox from '../../components/SemesterBox';

const cx = classNames.bind(styles);

function ClassSearch() {
    const filters = [
        {
            title: 'ID',
            code: 'id',
            onClick: () => {
                setFilter(filters[0]);
            },
        },
        {
            title: 'Tên học phần',
            code: 'courseName',
            onClick: () => {
                setFilter(filters[1]);
            },
        },
        {
            title: 'Giảng viên',
            code: 'teahcerName',
            onClick: () => {
                setFilter(filters[2]);
            },
        },
    ];
    const [filter, setFilter] = useState(filters[0]);
    const { payload } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tmp, setTmp] = useState('');
    const [classes, setClasses] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [page, setPage] = useState(1);
    const [semesterLst, setSemesterLst] = useState([]);
    const [semester, setSemester] = useState(null);
    const [_shifts, setShifts] = useState(null);
    useEffect(() => {
        const fun = async () => {
            try {
                let query = {
                    query: JSON.stringify({ status: 'openForRegistration' }),
                };
                let { metadata } = await fetchGet({
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
                if (semesters.length > 0) setSemester(semesters[0]);

                // shift
                query = {
                    query: JSON.stringify({}),
                };
                let { shifts } = (
                    await fetchGet({
                        base: classUrlSecure,
                        path: '/shift/search',
                        query: query,
                    })
                ).metadata;
                setShifts(shifts);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, []);

    useEffect(() => {
        const fun = async () => {
            try {
                if (semester == null) return;
                if (_shifts == null) return;

                const dict = _shifts.reduce((acc, item) => {
                    const { startAt, endAt } = item;
                    acc[item.id] = { startAt, endAt };
                    return acc;
                }, {});
                let query = {
                    page,
                    resultPerPage: 50,
                    query: JSON.stringify({
                        [filter.code]: searchTerm,
                        semesterId: semester.id,
                    }),
                };
                const tmp = await fetchGet({
                    base: classUrlSecure,
                    path: '/search',
                    query,
                });
                console.log(tmp);
                const { classes: _classes } = tmp.metadata;

                setClasses(
                    _classes.map((e) => {
                        let translatedSchedule = '';
                        e.schedule.forEach((s) => {
                            translatedSchedule += `Th${s.dayOfWeek}, từ ${
                                dict[s.startShift].startAt
                            } đến ${dict[s.endShift].endAt}\n`;
                        });
                        e.translatedSchedule = translatedSchedule;
                        return e;
                    }),
                );
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [searchTerm, page, filter, semester, _shifts]);

    const handleInputChange = (value) => {
        setTmp(value);
        // Clear the existing timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            setSearchTerm(value); // Update search term after 200ms
        }, 200);
        setDebounceTimeout(timeout);
    };

    const handleRowOnClick = (_class) => {
        if (payload && payload.role === RoleCode.BDT) {
            navigate(routePath.updateClass.split(':')[0] + `${_class.id}`, {
                replace: true,
            });
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('headerSection')}>
                <h1 className={cx('title')}>Học kì</h1>
                <SemesterBox semesterLst={semesterLst} semester={semester} />
            </div>
            {/* Search Form */}
            <div className={cx('searchContainer')}>
                <input
                    type="text"
                    value={tmp}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Môn học"
                    className={cx('searchInput')}
                />
                <DropDown items={filters}>
                    <button className={cx('searchButton')}>
                        {filter.title}
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                </DropDown>
            </div>

            <div className={cx('secondRow')}>
                {payload && payload.role === RoleCode.BDT && (
                    <button
                        className={cx('add-button')}
                        onClick={() => {
                            navigate(routePath.addClass, { replace: true });
                        }}
                    >
                        Thêm mới
                    </button>
                )}

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
            </div>

            {/* Results Table */}
            <div className={cx('tableContainer')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Mã lớp học</th>
                            <th>Học phần</th>
                            <th>Giảng viên</th>
                            <th>Sĩ số</th>
                            <th>Lịch học</th>
                            <th>Tình trạng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((_class, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowOnClick(_class)}
                            >
                                <td>{_class.id}</td>
                                <td>{_class.courseName}</td>
                                <td>{_class.teacherName}</td>
                                <td>{`${_class.currentEnroll || 0}/${
                                    _class.maxCapacity || 'x'
                                }`}</td>
                                <td>{_class.translatedSchedule}</td>
                                <td>{_class.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClassSearch;
