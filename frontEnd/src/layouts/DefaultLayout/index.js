import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import Sidebar from '../../components/SideBar/sidebar.index';
import Footer from '../../components/Footer';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('dashboard')}>
            <Header />
            <div className={cx('contentWrapper')}>
                <Sidebar />
                <div className={cx('mainContent')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
