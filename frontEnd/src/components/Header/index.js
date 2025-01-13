import React, { useEffect, useState } from 'react';
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
    const { payload, auth } = useAuth();
    const navigate = useNavigate();
    const menuItems = [
        {
            name: 'Trang chủ',
            href: routePath.home,
        },
        {
            name: 'Thông tin cá nhân',
            href: routePath.user,
            allow: (auth, role) => {
                return [RoleCode.STUDENT, RoleCode.STUDENT].includes(role);
            },
        },
        {
            name: 'Môn học',
            href: routePath.course,
        },
        // {
        //     name: 'Giảng viên',
        //     href: routePath.teacher,
        // },
        {
            name: 'Đăng ký',
            href: routePath.enroll,
            allow: (auth, role) => {
                return [RoleCode.STUDENT].includes(role);
            },
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
            ],
        },
        {
            name: 'Tra cứu',
            href: routePath.search,
        },
        {
            name: 'Phòng học',
            href: routePath.room,
            allow: (auth, role) => {
                return [RoleCode.BCSVC].includes(role);
            },
        },
        {
            name: 'Lớp học',
            href: routePath.class,
            allow: (auth, role) => {
                return [RoleCode.BDT].includes(role);
            },
        },
        {
            name: 'Kì học',
            href: routePath.semester,
            allow: (auth, role) => {
                return [RoleCode.BDT].includes(role);
            },
        },
        {
            name: 'Lịch đăng ký',
            href: routePath.search,
            allow: (auth, role) => {
                return [RoleCode.BDT].includes(role);
            },
        },
        {
            name: 'Quản lý sinh viên',
            href: routePath.search,
            allow: (auth, role) => {
                return [RoleCode.BCTSV].includes(role);
            },
        },
        {
            name: 'Quản lý giảng viên',
            href: routePath.search,
            allow: (auth, role) => {
                return [RoleCode.BTCNS].includes(role);
            },
        },
        {
            name: 'Tài liệu',
            href: routePath.document,
        },
        {
            name: 'Đăng nhập',
            href: routePath.login,
            allow: (auth, role) => {
                return !auth;
            },
        },
    ];

    const [items, setItems] = useState(menuItems);
    useEffect(() => {
        setItems(
            menuItems.filter((item) => {
                if (!item.allow) {
                    return true;
                }
                const tmpRole = (payload && payload.role) || '';
                if (item.allow(auth, tmpRole)) {
                    return true;
                }
                return false;
            }),
        );
    }, [payload, auth]);

    return (
        <header className={cx('header')}>
            <div className={cx('headerContainer')}>
                <div className={cx('logo')}>
                    <Link to={routePath.home}>HUST</Link>
                </div>
                <nav className={cx('mainNav')}>
                    <ul>
                        {items.map((item) => (
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
