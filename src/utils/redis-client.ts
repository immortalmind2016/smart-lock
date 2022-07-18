import { createClient } from "redis";
import envConfig from "../configs/env-config";
const { REDIS_HOST, REDIS_PORT } = envConfig;

export const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
