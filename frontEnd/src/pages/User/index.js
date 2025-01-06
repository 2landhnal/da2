import React from 'react';
import styles from './User.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import { useEffect, useState } from 'react';
import { fetchGet } from '../../utils/fetch.utils';
import { studentUrl } from '../../config';
import { useAuth } from '../../routes/authProvider.route';

const cx = classNames.bind(styles);

function User() {
    const { payload, setPayload } = useAuth();
    const [student, setStudent] = useState({});
    useEffect(() => {
        const getInfor = async () => {
            const options = {
                headers: {
                    'x-user-id': payload.uid,
                    'x-user-role': payload.role,
                },
            };

            const response = await fetchGet(
                studentUrl,
                `${payload.uid}`,
                options,
                false,
            );
            console.log(response);
            if (response.metadata && response.metadata.student)
                setStudent(response.metadata.student);
            console.log(payload.avatar);
        };
        getInfor();
    }, []);
    return (
        <div className={cx('dashboard')}>
            <div className={cx('main-container')}>
                {/* Main Content */}
                <main className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <div className={cx('image-card')}>
                            <Image
                                className={cx(
                                    'user-avatar',
                                    'placeholder-image',
                                )}
                                src={student.avatar}
                                alt="User Avatar"
                            />
                        </div>
                        <div className={cx('content-text')}>
                            <div className={cx('text-line-large')}>
                                Họ và tên: {student.fullname}
                            </div>
                            <div className={cx('text-line')}>
                                Mã số sinh viên: {student.uid}
                            </div>
                            <div className={cx('text-line')}>
                                Tình trạng học tập : Học
                            </div>
                            <div className={cx('text-line')}>
                                Giới tính: Nam
                            </div>
                            <div className={cx('text-line')}>
                                Khóa học: {student.yoa - 2021 + 66}
                            </div>
                            <div className={cx('text-line')}>
                                Email: {student.email}
                            </div>
                        </div>
                    </div>
                    <div className={cx('content-body')}>
                        <div className={cx('text-line')}>
                            Tổng kết học kỳ : 20232
                        </div>
                        <div className={cx('text-line')}>
                            Trung bình tích lũy : 3.3
                        </div>
                        <div className={cx('text-line')}>
                            Số TC tích lũy : 108
                        </div>
                        <div className={cx('text-line')}>Mức cảnh báo : M0</div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default User;
