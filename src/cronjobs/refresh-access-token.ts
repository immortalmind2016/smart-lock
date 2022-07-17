//NOTE: it can be run inside kuberenets cronjob instead of invoke these functions

import { AccessToken } from "../modules/token/entities/access-token.entity";
import nodeSchedule from "node-schedule";
import dayjs from "dayjs";
import { refreshAccessToken } from "../utils/tuya-services";
import { generateAccessToken } from "../modules/token/utils/generate-token";
import { setTokenInRedis } from "../utils/redis-setter-getter";

const updateAccessToken = async (token: AccessToken) => {
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

export const refreshAccessJob: nodeSchedule.Job = nodeSchedule.scheduleJob(
  "*/2 * * * *",
  async () => {
    const currentDate = dayjs();
    let token = (
      await AccessToken.find({ take: 1, order: { created_at: "DESC" } })
    )[0];
    if (!token) {
      token = await generateAccessToken();
    }
    try {
      if (dayjs(token.expire_date).isBefore(currentDate)) {
        console.log("generate new token");
        await AccessToken.clear();
        const newToken = await generateAccessToken();
        await setTokenInRedis(newToken);
      } else if (
        dayjs(token.expire_date).subtract(5, "minute").isBefore(currentDate) &&
        !dayjs(token.expire_date).isBefore(currentDate)
      ) {
        console.log("refresh token");
        await updateAccessToken(token);
        await setTokenInRedis(token);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }
);
