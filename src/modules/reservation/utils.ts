import { AccessToken } from "modules/token/entities/access-token.entity";
import { redisClient } from "../../utils/redis-client";

export const deviceLocalKeyRedis = (deviceId: string) =>
  `local_key-${deviceId}`;

export const generatePassword = () =>
  Math.floor(1000000 + Math.random() * 9000000);

export const setDeviceLocalKeyInRedis = (deviceId: string, local_key: string) =>
  redisClient.set(deviceLocalKeyRedis(deviceId), local_key);

export const redisDeviceLocalKey = (deviceId: string) =>
  redisClient.get(deviceLocalKeyRedis(deviceId));

export const redistAccessToken: () => Promise<AccessToken> = async () =>
  JSON.parse((await redisClient.get("access_token")) || "");
