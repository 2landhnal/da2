import React, { useEffect, useState } from 'react';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { fetchDelete } from '../../utils/fetch.utils';
import { routePath } from '../../routes';
import { authUrl } from '../../config';
import { Link } from 'react-router-dom';
import { RoleCode } from '../../config/roleCode';
import { useAuth } from '../../routes/authProvider.route';

const cx = classNames.bind(styles);

function Sidebar() {
    const { auth, payload } = useAuth();
    const handleLogout = async () => {
        await fetchDelete({ base: authUrl, path: 'logout', cookies: true });
        localStorage.removeItem('accessToken');
        navigate(routePath.login);
    };
    const sidebarItems = [
        { name: 'Thông báo', href: '#' },
        { name: 'Đổi mật khẩu', href: routePath.changePassword },
        {
            name: 'Cập nhật thông tin',
            href: routePath.updateInformation,
            allow: [RoleCode.STUDENT, RoleCode.TEACHER],
        },
        {
            name: 'Thời khóa biểu',
            href: routePath.timeTable,
            allow: [RoleCode.STUDENT],
        },
        {
            name: 'Lịch giảng dạy',
            href: routePath.timeTable,
            allow: [RoleCode.TEACHER],
        },
        {
            name: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];
    const [items, setItems] = useState(sidebarItems);
    const navigate = useNavigate();
    useEffect(() => {
        setItems(
            auth
                ? sidebarItems.filter((item) => {
                      if (item.allow) {
                          if (
                              payload &&
                              payload.role &&
                              item.allow.includes(payload.role)
                          ) {
                              return true;
                          }
                          return false;
                      }
                      return true;
                  })
                : [],
        );
    }, [payload, auth]);

    return (
        <aside className={cx('sidebar')}>
            <nav className={cx('sidebarNav')}>
                {items.map((item) => (
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
