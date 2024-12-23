import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import logo from '../../assets/images/logo.png';
import { classCombine } from '../../utils/helper';
import { Link, NavLink } from 'react-router-dom';
import { routePath } from '../../routes';
import { isAccessTokenExpired } from '../../utils/helper';
import { useEffect } from 'react';

const cx = classNames.bind(styles);
function combine(a) {
    return classCombine(a, cx);
}

function Header() {
    const crendentalOkay = !isAccessTokenExpired();
    console.log(crendentalOkay);
    return (
        <header className={cx('header-area', 'header-sticky')}>
            <ul className={cx('ul-container')}>
                <li>
                    <Link to={routePath.home} className="active">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={routePath.login} className="active">
                        Login
                    </Link>
                </li>
                <li>
                    <Link to={routePath.user} className="active">
                        User
                    </Link>
                </li>
                <li>
                    <Link to={routePath.schedule} className="active">
                        Schedule
                    </Link>
                </li>
                <li>
                    <Link to={routePath.semester} className="active">
                        Semester
                    </Link>
                </li>
                <li>
                    <Link to={routePath.registration} className="active">
                        Registration
                    </Link>
                </li>
            </ul>
        </header>
    );
}

export default Header;
