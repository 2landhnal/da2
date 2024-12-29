import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function App() {
    return (
        <div className={cx('dashboard')}>
            <div className={cx('main-container')}>
                {/* Sidebar */}
                <aside className={cx('sidebar')}>
                    <nav className={cx('sidebar-nav')}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className={cx('sidebar-link')}
                            >
                                Menu Item {item}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <div className={cx('image-card')}>
                            <div className={cx('placeholder-image')}></div>
                        </div>
                        <div className={cx('content-text')}>
                            <div className={cx('text-line-large')}></div>
                            <div className={cx('text-line')}></div>
                            <div className={cx('text-line')}></div>
                        </div>
                    </div>
                    <div className={cx('content-body')}>
                        <div className={cx('text-line')}></div>
                        <div className={cx('text-line')}></div>
                        <div className={cx('text-line')}></div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
