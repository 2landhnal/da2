import React from 'react';
import styles from './User.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import { useEffect, useState, useRef } from 'react';
import { fetchGet, fetchPut } from '../../utils/fetch.utils';
import { studentUrl, studentUrlSecure } from '../../config';
import { useAuth } from '../../routes/authProvider.route';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE } from '../../config/header';

const cx = classNames.bind(styles);

function User() {
    const { payload } = useAuth();
    const [student, setStudent] = useState({});
    useEffect(() => {
        const getInfor = async () => {
            const response = await fetchGet({
                base: studentUrlSecure,
                path: `${payload.uid}`,
                cookies: false,
            });
            if (!response.ok) {
                toast.error(response.message || 'Invalid information', {
                    autoClose: 3000,
                });
                console.error(
                    `Load user information failed: ${response.message}`,
                );
            } else {
                console.log({ response });
                if (
                    response &&
                    response.metadata &&
                    response.metadata.student
                ) {
                    setStudent(response.metadata.student);
                    setAvatar(response.metadata.student.avatar);
                }
            }
        };
        getInfor();
    }, []);

    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target.result);
            };
            reader.readAsDataURL(file);

            // fetch
            const formData = new FormData();
            formData.append('avatar', file); // 'avatar' là tên trường trên server
            formData.append('uid', payload.uid);
            let response = await fetchPut({
                base: studentUrlSecure,
                path: `changeAvatar`,
                body: formData,
                cookies: false,
                contentType: null,
            });
            if (response.ok) {
                toast.success('Change avatar success!', {
                    autoClose: 3000,
                });
            } else {
                toast.error(response.message || 'Invalid information', {
                    autoClose: 3000,
                });
            }
        }
    };
    return (
        <div className={cx('container')}>
            {/* Personal Information Header */}
            <h1 className={cx('header-main')}>THÔNG TIN CÁ NHÂN</h1>

            {/* Student Information Section */}
            <div className={cx('info-section')}>
                <h2 className={cx('section-header')}>THÔNG TIN SINH VIÊN</h2>

                <div className={cx('student-info-grid')}>
                    {/* Profile Image */}
                    <div className={cx('profile-container')}>
                        <div className={cx('avatar-col')}>
                            <div
                                className={cx('image-card')}
                                onClick={handleAvatarClick}
                            >
                                <Image
                                    className={cx(
                                        'user-avatar',
                                        'placeholder-image',
                                    )}
                                    src={avatar}
                                    alt="User Avatar"
                                />
                                <div className={cx('avatar-overlay')}>
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className={cx('avatar-icon')}
                                    />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <p className={cx('student-id')}>
                                <span className={cx('label')}>MSSV: </span>
                                {student.uid}
                            </p>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className={cx('details-grid')}>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Họ và tên:</span>
                            <span>{student.fullname}</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Giới tính:</span>
                            <span>
                                {student.gender === 'male' ? 'Nam' : 'Nữ'}
                            </span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Năm vào trường:</span>
                            <span>{student.yoa}</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Lớp:</span>
                            <span>Toán-Tin 01-K66</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Bậc đào tạo:</span>
                            <span>Đại học đại trà</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Khóa học:</span>
                            <span>{student.yoa - 2021 + 66}</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Chương trình:</span>
                            <span>Toán-Tin 2021</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>Email:</span>
                            <span>{student.email}</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>
                                Khoa/Viện quản lý:
                            </span>
                            <span>Khoa Toán - Tin</span>
                        </div>
                        <div className={cx('info-row')}>
                            <span className={cx('label')}>
                                Tình trạng học tập:
                            </span>
                            <span>Học</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Information Section */}
            <div className={cx('info-section')}>
                <h2 className={cx('section-header')}>THÔNG TIN HỌC TẬP</h2>

                <div className={cx('academic-info-grid')}>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Tổng kết học kỳ:</span>
                        <span>20232</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Số TC tích lũy:</span>
                        <span>108</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>
                            Trung bình tích lũy:
                        </span>
                        <span>3.3</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Trình độ sinh viên:</span>
                        <span>4</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Số TC nợ đăng ký:</span>
                        <span>0</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Mức cảnh báo:</span>
                        <span>M0</span>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default User;
