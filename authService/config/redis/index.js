import * as Redis from 'redis';

class RedisClient {
    constructor() {
        this.connected = false; // Đánh dấu trạng thái kết nối
        this.connect();
    }

    async connect() {
        try {
            const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
            this.redisCli = Redis.createClient({ url: redisURL });

            this.redisCli.on('error', (err) =>
                console.error('Redis Client Error:', err),
            );

            this.redisCli.once('connect', () => {
                console.log('Redis connected successfully');
                this.connected = true; // Đánh dấu đã kết nối
            });

            await this.redisCli.connect(); // Đợi kết nối hoàn thành
        } catch (error) {
            console.error('Error connecting to Redis:', error);
            process.exit(1); // Exit process if Redis connection fails
        }
    }

    static async getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
            while (!RedisClient.instance.connected) {
                await new Promise((resolve) => setTimeout(resolve, 10)); // Đợi kết nối hoàn thành
            }
        }
        return RedisClient.instance;
    }
}

export const redisClient = (await RedisClient.getInstance()).redisCli;
