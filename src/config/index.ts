export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/mydatabase?schema=public',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
    },
    host: process.env.HOST,
    apiKey: process.env.API_KEY
})