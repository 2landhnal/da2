import React from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { routePath } from '../../routes';

const cx = classNames.bind(styles);

function Header() {
    const menuItems = [
        { name: 'Trang chủ', href: routePath.home },
        { name: 'Môn học', href: routePath.course },
        { name: 'Giảng viên', href: routePath.teacher },
        { name: 'Đăng ký', href: routePath.enrollment },
        { name: 'Tra cứu', href: routePath.search },
        { name: 'Tài liệu', href: routePath.document },
    ];

    return (
        <header className={cx('header')}>
            <div className={cx('headerContainer')}>
                <div className={cx('logo')}>
                    <Link to={routePath.landing}>HUST</Link>
                </div>
                <nav className={cx('mainNav')}>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link to={item.href}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
