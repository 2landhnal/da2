import React from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image';
import images from '../../assets/images';

const cx = classNames.bind(styles);

const Footer = () => {
    return <footer className={cx('footer')}></footer>;
};

export default Footer;
