import React from 'react';
import styles from './User.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';

const cx = classNames.bind(styles);

function User() {
    return (
        <div className={cx('dashboard')}>
            <div className={cx('main-container')}>
                {/* Main Content */}
                <main className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <div className={cx('image-card')}>
                            <div className={cx('placeholder-image')}>
                                <Image
                                    className={cx('user-avatar')}
                                    src="https://1.bp.blogspot.com/-VqNv4Rvn--4/XGJDujZsqmI/AAAAAAAA4As/mechGLfszq4qorJe3nW5s78VHFBpgePnQCLcBGAs/s1600/t%2526j07.jpg"
                                    alt="User Avatar"
                                />
                            </div>
                        </div>
                        <div className={cx('content-text')}>
                            <div className={cx('text-line-large')}>
                                Họ và tên: Cao Bảo Nguyên
                            </div>
                            <div className={cx('text-line')}>
                                Mã số sinh viên: 20216864
                            </div>
                            <div className={cx('text-line')}>
                                Tình trạng học tập : Học
                            </div>
                            <div className={cx('text-line')}>
                                Giới tính: Nam
                            </div>
                            <div className={cx('text-line')}>Khóa học: 66</div>
                            <div className={cx('text-line')}>
                                Email: nguyen.cb216864@sis.hust.edu.vn
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
