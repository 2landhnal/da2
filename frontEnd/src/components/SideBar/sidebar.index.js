import React from 'react';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { fetchDelete } from '../../utils/fetch.utils';
import { routePath } from '../../routes';
import { authUrl } from '../../config';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await fetchDelete(authUrl, 'logout', {}, true);
        localStorage.removeItem('accessToken');
        navigate(routePath.login);
    };
    const sidebarItems = [
        { name: 'Thông báo', href: '/notifications' },
        { name: 'Đổi mật khẩu', href: '/change-password' },
        { name: 'Cập nhật thông tin', href: '/update-info' },
        { name: 'Thời khóa biểu', href: '/schedule' },
        { name: 'Kế hoạch học tập', href: '/study-plan' },
        { name: 'Đăng xuất', onClick: handleLogout },
    ];

    return (
        <aside className={cx('sidebar')}>
            <nav className={cx('sidebarNav')}>
                {sidebarItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href || '#'}
                        className={cx('sidebarLink')}
                        onClick={item.onClick || null}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
