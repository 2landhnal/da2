import React, { useState } from 'react';
import styles from './Query.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { fetchGet } from '../../utils/fetch.utils';
import { classUrl } from '../../config';
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

const cx = classNames.bind(styles);

function Room() {
    const filters = [
        {
            title: 'ID',
            code: 'id',
            onClick: () => {
                setFilter(filters[0]);
            },
        },
        {
            title: 'Capacity',
            code: 'maxCapacity',
            onClick: () => {
                setFilter(filters[1]);
            },
        },
        {
            title: 'State',
            code: 'status',
            onClick: () => {
                setFilter(filters[2]);
            },
        },
    ];
    const { payload } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tmp, setTmp] = useState('');
    const [rooms, setRooms] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState(filters[0]);

    useEffect(() => {
        const fun = async () => {
            try {
                console.log({ search: searchTerm });
                const query = {
                    page,
                    resultPerPage: 50,
                    query: JSON.stringify({ [filter.code]: searchTerm }),
                };
                const { rooms: _rooms } = (
                    await fetchGet({
                        base: classUrl,
                        path: '/room/search',
                        query,
                    })
                ).metadata;

                console.log({ _rooms });

                setRooms(_rooms);
            } catch (error) {
                console.log(error);
            }
        };
        fun();
    }, [searchTerm, page, filter]);

    // // Sample room data
    // const rooms = [
    //     { code: 'MI2022', name: 'CTDL&GT', credits: 3 },
    //     { code: 'MI2023', name: 'CTDL&TT', credits: 3 },
    // ];

    const handleInputChange = (value) => {
        console.log({ value });
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

    const handleRowOnClick = (room) => {
        if (payload && payload.role === RoleCode.BCSVC) {
            navigate(routePath.updateRoom.split(':')[0] + `${room.id}`, {
                replace: true,
            });
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
                    placeholder="Phòng học"
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
                {payload && payload.role === RoleCode.BCSVC && (
                    <button
                        className={cx('add-button')}
                        onClick={() => {
                            navigate(routePath.addRoom, { replace: true });
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
                            <th>Mã phòng học</th>
                            <th>Sức chứa tối đa</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr
                                key={index}
                                onClick={() => {
                                    handleRowOnClick(room);
                                }}
                            >
                                <td>{room.id}</td>
                                <td>{room.maxCapacity}</td>
                                <td>{room.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Room;
