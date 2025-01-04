import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '../index.js';
import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Menu({
    children,
    items = [],
    hideOnClick = false,
    // onChange = () => {},
}) {
    const [history, setHistory] = useState([{ data: items }]);
    var current = history[history.length - 1];
    const renderItems = () => {
        return current.data.map((e, index) => {
            const isParent = !!e.children;
            return (
                <MenuItem
                    key={index}
                    item={e}
                    onClick={(event) => {
                        event.stopPropagation();
                        if (isParent) {
                            setHistory((prev) => {
                                console.log([...prev, e.children]);
                                return [...prev, e.children];
                            });
                        } else if (!e.to) {
                            if (e.onClick) {
                                e.onClick();
                            } else {
                                console.log(e);
                            }
                        }
                    }}
                />
            );
        });
    };

    function getRenderItems(attrs) {
        return (
            <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                <PopperWrapper className={cx('menu-popper')}>
                    {history.length > 1 && (
                        <Header title={current.title} onBack={handleBack} />
                    )}
                    <div className={cx('scrollable')}>{renderItems()}</div>
                </PopperWrapper>
            </div>
        );
    }

    function handleBack() {
        setHistory((prev) => prev.slice(0, prev.length - 1));
    }

    const resetMenu = () => setHistory((prev) => prev.slice(0, 1));
    return (
        <Tippy
            hideOnClick={hideOnClick}
            interactive
            delay={[0, 500]}
            placement="bottom-end"
            onHide={resetMenu}
            render={getRenderItems}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Menu;
