import styles from './Item.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Item({ item, onClick = () => {} }) {
    return (
        <div className={cx('item')} onClick={onClick}>
            {item.title}
        </div>
    );
}

export default Item;
