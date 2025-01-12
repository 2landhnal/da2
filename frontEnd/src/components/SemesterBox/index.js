import DropDown from '../DropDown';
import styles from './SemesterBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SemesterBox({ semesterLst, semester }) {
    return (
        <DropDown items={semesterLst}>
            <span className={cx('semester')}>{semester?.title || '00000'}</span>
        </DropDown>
    );
}

export default SemesterBox;
