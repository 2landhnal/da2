import { useState } from 'react';
import DropDown from '../DropDown';
import styles from './MultiSelectBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MultiSelectBox({ itemList, selectedItems, setSelectedItems }) {
    const toggleSelect = (index) => {
        setSelectedItems(
            (prevSelectedItems) =>
                prevSelectedItems.includes(index)
                    ? prevSelectedItems.filter((item) => item !== index) // Remove if already selected
                    : [...prevSelectedItems, index], // Add if not selected
        );
    };

    const enhancedItemList = itemList.map((item, index) => ({
        ...item,
        onClick: () => toggleSelect(index),
    }));
    return (
        <DropDown items={enhancedItemList}>
            <span className={cx('box')}>
                {selectedItems.map((e) => itemList[e].title).join(', ')}
            </span>
        </DropDown>
    );
}

export default MultiSelectBox;
