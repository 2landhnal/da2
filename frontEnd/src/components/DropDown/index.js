import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import Item from './Item';
import styles from './DropDown.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DropDown({
    items = [],
    children,
    hideOnClick = true,
    onHide = () => {},
}) {
    const getRenderItems = (items) =>
        items.map((item, index) => {
            return <Item key={index} item={item} onClick={item.onClick} />;
        });
    return (
        <Tippy
            hideOnClick={hideOnClick}
            interactive
            delay={[0, 100]}
            placement="bottom"
            onHide={onHide}
            render={
                items.length > 0
                    ? (attrs) => (
                          <div className={cx('itemWrapper')}>
                              {getRenderItems(items)}
                          </div>
                      )
                    : () => <div></div>
            }
        >
            {children}
        </Tippy>
    );
}

export default DropDown;
