import React, { useState } from 'react';
import styles from './Form.module.scss';
import classNames from 'classnames/bind';
import { authUrl, classUrlSecure, roomUrl, roomUrlSecure } from '../../config';
import { routePath } from '../../routes';
import { fetchPost, fetchGet, fetchPut } from '../../utils/fetch.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../routes/authProvider.route';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function UpdateRoom() {
    const { id } = useParams();
    // const id = 'MI3535';
    const [formData, setFormData] = useState({
        id,
        maxCapacity: '',
    });
    const [room, setRooms] = useState({});
    useEffect(() => {
        const fun = async () => {
            try {
                const { room: _room } = (
                    await fetchGet({ base: classUrlSecure, path: `room/${id}` })
                ).metadata;
                setFormData(_room);
                setRooms(_room);
            } catch (error) {
                toast.error(error, { autoClose: 3000 });
            }
        };
        fun();
    }, []);

    const handleClose = async () => {
        const response = await fetchPut({
            base: classUrlSecure,
            path: '/room',
            body: { id: room.id, status: 'close' },
        });
        if (response.ok) {
            setRooms((prev) => {
                // Tạo bản sao mới của trạng thái trước đó
                return { ...prev, status: 'close' };
            });
            toast.success(response.message, { autoClose: 3000 });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Update failed: ${response.message}`);
        }
    };

    const handleActive = async () => {
        const response = await fetchPut({
            base: classUrlSecure,
            path: '/room',
            body: { id: room.id, status: 'active' },
        });
        if (response.ok) {
            setRooms((prev) => {
                // Tạo bản sao mới của trạng thái trước đó
                return { ...prev, status: 'active' };
            });
            toast.success(response.message, { autoClose: 3000 });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Update failed: ${response.message}`);
        }
    };

    const handleUpdateRoom = async () => {
        console.log(formData);
        let response;
        response = await fetchPut({
            base: classUrlSecure,
            path: '/',
            body: formData,
        });
        if (response.ok) {
            toast.success(response.message, { autoClose: 3000 });
            // navigate(routePath.home, { replace: true });
        } else {
            toast.error(response.message || 'Invalid information', {
                autoClose: 3000,
            });
            console.error(`Update infor failed: ${response.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateRoom();
    };

    return (
        <div className={cx('container')}>
            <div className={cx('card')}>
                <h1>Cập nhật phòng học</h1>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="id">Mã phòng học</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            placeholder="Mã phòng học"
                            readOnly
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="maxCapacity">Sức chứa tối đa</label>
                        <input
                            type="number"
                            id="maxCapacity"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleInputChange}
                            onSubmit={(e) => e.target.reportValidity()}
                            placeholder="Sức chứa tối đa"
                            required
                        />
                    </div>

                    <button type="submit" className={cx('button', 'primary')}>
                        Update
                    </button>
                    {room && room.status === 'active' && (
                        <button
                            type="button"
                            className={cx('button', 'delete')}
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            Close
                        </button>
                    )}
                    {room && room.status === 'close' && (
                        <button
                            type="button"
                            className={cx('button', 'active')}
                            onClick={() => {
                                handleActive();
                            }}
                        >
                            Active
                        </button>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateRoom;
