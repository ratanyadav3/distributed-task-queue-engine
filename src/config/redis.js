import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on("error", (err) => {
    console.error("Redis Error:", err);
});

async function connectRedis() {
    await redis.connect();
    console.log("Redis connected");
}

export {
    redis,
    connectRedis
};