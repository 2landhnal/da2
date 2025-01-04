import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';

const cx = classNames.bind(styles);

function HomePage() {
    const planItems = [
        {
            month: 'Tháng 10',
            day: '31',
            title: '[ĐTĐH] LỊCH THI GIỮA KỲ - CUỐI KỲ HỌC KỲ 1 NĂM HỌC 2024-2025 (20241 - A- AB - B)',
            date: '31.10.2024',
        },
        {
            month: 'Tháng 12',
            day: '09',
            title: '[ĐTĐH] KẾ HOẠCH CẤP PHÁT CHỨNG CHỈ GIÁO DỤC QUỐC PHÒNG - K68 (ĐỢT 2)',
            date: '9/12/2024',
        },
        {
            month: 'Tháng 11',
            day: '27',
            title: '[ĐTĐH] THÔNG BÁO MỞ ĐĂNG KÝ TỐT NGHIỆP ĐỢT 2024.1A',
            date: '27/11/2024',
        },
    ];

    const newsItems = [
        {
            image: 'https://ctt.hust.edu.vn/Images/news-1.jpg',
            title: '[CTSV]Thông báo về việc mua Bảo hiểm y tế (BHYT) đợt tháng 2/2025',
            date: '3/1/2025',
        },
        {
            image: 'https://ctt.hust.edu.vn/Images/news-1.jpg',
            title: '[CTSV]Thông báo về việc trang bị dây đeo thẻ cho sinh viên K69',
            date: '2/1/2025',
        },
        {
            image: 'https://ctt.hust.edu.vn/Images/news-1.jpg',
            title: '[ĐT]Quyết định tiếp nhận vào học CT KSCS đợt tháng 12.2024',
            date: '30/12/2024',
        },
    ];

    return (
        <div className={cx('homepage')}>
            {/* Hero/Banner Section */}
            <section className={cx('hero')}></section>

            {/* Main Content Section */}
            <section className={cx('mainContent')}>
                {/* Plan Section */}
                <div className={cx('section')}>
                    <h2 className={cx('sectionTitle')}>KẾ HOẠCH</h2>
                    <div className={cx('sectionContent')}>
                        {planItems.map((item, index) => (
                            <div key={index} className={cx('planItem')}>
                                <div className={cx('dateBox')}>
                                    <div className={cx('month')}>
                                        {item.month}
                                    </div>
                                    <div className={cx('day')}>{item.day}</div>
                                </div>
                                <div className={cx('itemContent')}>
                                    <h3 className={cx('itemTitle')}>
                                        {item.title}
                                    </h3>
                                    <div className={cx('itemDate')}>
                                        {item.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News Section */}
                <div className={cx('section')}>
                    <h2 className={cx('sectionTitle')}>TIN TỨC</h2>
                    <div className={cx('sectionContent')}>
                        {newsItems.map((item, index) => (
                            <div key={index} className={cx('newsItem')}>
                                <img
                                    src={item.image}
                                    alt=""
                                    className={cx('newsImage')}
                                />
                                <div className={cx('itemContent')}>
                                    <h3 className={cx('itemTitle')}>
                                        {item.title}
                                    </h3>
                                    <div className={cx('itemDate')}>
                                        {item.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
