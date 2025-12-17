import Redis from "ioredis";
import "dotenv/config";

export const QUEUE_NAME = "video_jobs";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379)
});
