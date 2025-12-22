import Redis from "ioredis";

let redis;

// Toggle this if you install Redis locally
const ENABLE_REDIS = false;

// Simple In-Memory Mock for Redis if connection fails
class MockRedis {
    constructor() {
        this.store = new Map(); // For simple key-value pairs
        this.sets = new Map(); // For set operations (sadd, srem, smembers)
        console.log("---------------------------------------------------");
        console.log("⚠️  REDIS NOT FOUND - USING IN-MEMORY FALLBACK ⚠️");
        console.log("   (Install redis-server to use real Redis)      ");
        console.log("---------------------------------------------------");
    }

    on(event, callback) {
        if (event === "connect") {
            setTimeout(callback, 100);
        };
    }

    async set(key, value) {
        this.store.set(key, value);
        return "OK";
    }

    async get(key) {
        return this.store.get(key) || null;
    }

    async del(key) {
        this.store.delete(key);
        return 1;
    }

    async sadd(key, value) {
        if (!this.sets.has(key)) {
            this.sets.set(key, new Set());
        }
        this.sets.get(key).add(value);
        return 1;
    }

    async srem(key, value) {
        if (this.sets.has(key)) {
            this.sets.get(key).delete(value);
        }
        return 1;
    }

    async smembers(key) {
        if (this.sets.has(key)) {
            return Array.from(this.sets.get(key));
        }
        return [];
    }
}

if (ENABLE_REDIS) {
    redis = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
    });

    redis.on("connect", () => {
        console.log("Redis connected");
    });

    redis.on("error", (err) => {
        console.error("Redis connection error:", err);
    });
} else {
    redis = new MockRedis();
}

export default redis;
