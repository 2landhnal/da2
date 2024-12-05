import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { checkCredential, classCombine } from '../../utils/helper';
import { post } from '../../utils/httpRequests.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../config';
import { isTokenExpired } from '../../utils/helper';

const cx = classNames.bind(styles);
function combine(a) {
    return classCombine(a, cx);
}

function Login() {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            username: 'abc@gmail.com',
            password: '12345678910',
        };

        try {
            const response = await post(
                process.env.REACT_APP_AUTH_URL,
                '/login',
                body,
            );
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            navigate(config.routes.home);
        } catch (error) {
            console.error(
                'Error during login:',
                error.response?.data || error.message,
            );
            navigate(config.routes.error);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <form className={cx('mainForm')} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                    />
                    <label className="form-check-label" for="exampleCheck1">
                        Check me out
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Login;
