import React from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { routePath } from '../../routes';
import DropDown from '../DropDown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../routes/authProvider.route';
import { RoleCode } from '../../config/roleCode';

const cx = classNames.bind(styles);

function Header() {
    const { payload } = useAuth();
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Trang chủ', href: routePath.home },
        { name: 'Thông tin cá nhân', href: routePath.user },
        {
            name: 'Môn học',
            href: routePath.course,
            dropdown:
                payload && payload.role === RoleCode.BDT
                    ? [
                          {
                              title: 'Thêm học phần',
                              onClick: () => {
                                  navigate(routePath.addCourse, {
                                      replace: true,
                                  });
                              },
                          },
                      ]
                    : [],
        },
        { name: 'Giảng viên', href: routePath.teacher },
        {
            name: 'Đăng ký',
            href: routePath.enroll,
            dropdown: [
                {
                    title: 'Danh sách môn học mở trong kì',
                    onClick: () => {
                        navigate(routePath.openCourses, { replace: true });
                    },
                },
                {
                    title: 'Danh sách lớp học mở trong kì',
                    onClick: () => {
                        console.log('Danh sách lớp học mở trong kì');
                    },
                },
                {
                    title: 'Đăng ký',
                    onClick: () => {
                        console.log('Danh sách lớp học mở trong kì');
                    },
                },
            ],
        },
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
                                {item.dropdown ? (
                                    <DropDown items={item.dropdown || []}>
                                        <Link to={item.href}>{item.name}</Link>
                                    </DropDown>
                                ) : (
                                    <Link to={item.href}>{item.name}</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
