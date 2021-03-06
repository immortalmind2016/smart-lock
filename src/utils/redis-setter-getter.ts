import { AccessToken } from "../modules/token/entities/access-token.entity";
import { redisClient } from "./redis-client";

export const setTokenInRedis = (token: AccessToken) => {
  return redisClient.set("access_token", JSON.stringify(token));
};
export const redistAccessToken: () => Promise<AccessToken> = async () =>
  JSON.parse((await redisClient.get("access_token")) || "");
