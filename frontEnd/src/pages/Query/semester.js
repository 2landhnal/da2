import React, { useState } from 'react';
import styles from './Query.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { fetchGet } from '../../utils/fetch.utils';
import { semesterUrl, semesterUrlSecure } from '../../config';
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
import {
    utcDatetimeToLocalDate,
    utcToLocalDate,
} from '../../utils/dateTime.handler';

const cx = classNames.bind(styles);

function SemesterSearch() {
    const filters = [
        {
            title: 'ID',
            code: 'id',
            onClick: () => {
                setFilter(filters[0]);
            },
        },
        {
            title: 'Trạng thái',
            code: 'status',
            onClick: () => {
                setFilter(filters[1]);
            },
        },
    ];
    const [filter, setFilter] = useState(filters[0]);
    const { payload } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tmp, setTmp] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fun = async () => {
            try {
                const query = {
                    page,
                    resultPerPage: 50,
                    query: JSON.stringify({ [filter.code]: searchTerm }),
                };
                let { semesters: _semesters } = (
                    await fetchGet({
                        base: semesterUrlSecure,
                        path: '/search',
                        query,
                    })
                ).metadata;
                _semesters = _semesters.map((s) => {
                    s.startDate = utcDatetimeToLocalDate(s.startDate);
                    s.endDate = utcDatetimeToLocalDate(s.endDate);
                    return s;
                });
                setSemesters(_semesters);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [searchTerm, page, filter]);

    // // Sample semester data
    // const semesters = [
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
            setSearchTerm(value); // Update search term after 200ms
        }, 200);
        setDebounceTimeout(timeout);
    };

    const handleRowOnClick = (semester) => {
        if (payload && payload.role === RoleCode.BDT) {
            navigate(
                routePath.updateSemester.split(':')[0] + `${semester.id}`,
                {
                    replace: true,
                },
            );
        }
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
                            navigate(routePath.addSemester, { replace: true });
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
                            <th>Học kì</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.map((semester, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowOnClick(semester)}
                            >
                                <td>{semester.id}</td>
                                <td>{semester.startDate}</td>
                                <td>{semester.endDate}</td>
                                <td>{semester.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SemesterSearch;
