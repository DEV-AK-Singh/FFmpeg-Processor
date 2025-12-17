import Redis from "ioredis";

export const QUEUE_NAME = "video_jobs";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});
