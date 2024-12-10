// const redis = require('redis');
// const redisCli = redis.createClient();
// const DEFAULT_EXPIRE_TIME = 3600; //second
// const getOrCache = async (key, callback) => {
//     return new Promise((resolve, reject) => {
//         redisCli.get(key, async (error, data) => {
//             if (error) return reject(error);
//             if (data != null) return resolve(JSON.parse(data));
//             const freshData = await callback();
//             redisCli.setex(key, DEFAULT_EXPIRE_TIME, JSON.stringify(freshData));
//             resolve(freshData);
//         });
//     });
// };
