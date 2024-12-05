import { useEffect, useState } from 'react';
import { get } from '../../utils/httpRequests';
function Home() {
    const [accountId, setAccountId] = useState('undefined');
    // useEffect(() => {
    //     const options = {
    //         headers: {
    //             authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //         },
    //     };
    //     const getAccountId = async () => {
    //         const response = await get(
    //             process.env.REACT_APP_AUTH_URL,
    //             '/getAccount',
    //             options,
    //         );
    //         console.log(response);
    //         setAccountId(response.accountId);
    //     };
    //     getAccountId();
    // }, []);
    return (
        <div>
            <h2>Home</h2>
            <p>accountId</p>
        </div>
    );
}

export default Home;
