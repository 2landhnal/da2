import { forwardRef, useState } from 'react';
import images from '../../assets/images';
import styles from './Image.module.scss';
import classNames from 'classnames';

function Image({ src, className, customFallback, ...props }, ref) {
    const [fallback, setFallback] = useState('');

    const handleError = () => {
        console.log('error', images.defaultImage);
        setFallback(customFallback || images.defaultImage);
    };
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            src={fallback || src}
            className={classNames(className, styles.wrapper)}
            ref={ref}
            {...props}
            onError={handleError}
        />
    );
}

export default forwardRef(Image);
