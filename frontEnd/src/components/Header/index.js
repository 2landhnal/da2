import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link, NavLink } from 'react-router-dom';
import { routePath } from '../../routes';
import { fetchDelete } from '../../utils/fetch.utils';
import { useEffect } from 'react';
import { authUrl } from '../../config';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await fetchDelete(authUrl, 'logout', {}, true);
        localStorage.removeItem('accessToken');
        navigate(routePath.login);
    };
    return (
        <header className={cx('header')}>
            <div className={cx('header-container')}>
                <div className={cx('logo')}></div>
                <nav className={cx('nav-links')}>
                    <Link to={routePath.landing} className={cx('nav-link')}>
                        Landing
                    </Link>
                    <Link to={routePath.home} className={cx('nav-link')}>
                        Home
                    </Link>
                    <Link to={routePath.login} className={cx('nav-link')}>
                        Login
                    </Link>
                    <button
                        className={cx('menu-button')}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
