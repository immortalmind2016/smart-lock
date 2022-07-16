//NOTE: it can be run inside kuberenets cronjob instead of invoke these functions

import { AccessToken } from "../modules/token/entities/access-token.entity";
import nodeSchedule from "node-schedule";
import dayjs from "dayjs";
import { refreshAccessToken } from "../utils/tuya-services";
import { redisClient } from "../utils/redis-client";
import { generateAccessToken } from "../modules/token/utils/generate-token";

const updateAccessToken = async (token: AccessToken) => {
  console.log({ updateAccessToken: token });
  const { access_token, expire_time, refresh_token } =
    (await refreshAccessToken(token.refresh_token)) || {};
  await AccessToken.update(
    { id: token.id },
    {
      expire_date: dayjs().add(expire_time, "second").toDate(),
      token: access_token,
      refresh_token,
    }
  );
};

const setTokenInRedis = (token: AccessToken) => {
  console.log({ setTokenInRedis: token });
  return redisClient.set("access_token", JSON.stringify(token));
};

export const refreshAccessJob: nodeSchedule.Job = nodeSchedule.scheduleJob(
  "* * * * * *",
  async () => {
    console.log("Every second", {
      redisKey: await redisClient.get("access_token"),
    });
    const currentDate = dayjs();
    const token = (
      await AccessToken.find({ take: 1, order: { created_at: "DESC" } })
    )[0];
    if (dayjs(token.expire_date).isBefore(currentDate)) {
      const newToken = await generateAccessToken();
      await setTokenInRedis(newToken);
    }
    if (
      dayjs(token.expire_date).subtract(5, "minute").isBefore(currentDate) &&
      !dayjs(token.expire_date).isBefore(currentDate)
    ) {
      await updateAccessToken(token);
      await setTokenInRedis(token);
    }
  }
);
