import dayjs from "dayjs";
import { AppDataSource } from "../../../configs/data-source";
import { AccessToken } from "../entities/access-token.entity";
import { getAccessToken } from "../../../utils/tuya-services";
import envConfig from "../../../configs/env-config";
import { setTokenInRedis } from "../../../utils/redis-setter-getter";
import { redisClient } from "../../../utils/redis-client";

const { CLI } = envConfig;

export const generateAccessToken = async () => {
  await redisClient.connect();
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const { access_token, expire_time, refresh_token, uid } =
    (await getAccessToken()) || {};

  const currentDate = dayjs();
  await AccessToken.clear();
  const newToken = AccessToken.create({
    created_at: currentDate.toDate(),
    expire_time,
    id: uid,
    refresh_token,
    token: access_token,
    expire_date: currentDate.add(expire_time, "second").toDate(),
  });
  const token = await newToken.save();
  await setTokenInRedis(token);
  console.log("access token has been created ");
  await redisClient.disconnect();
  await AppDataSource.destroy();
  return token;
};
if (CLI) {
  generateAccessToken();
}
