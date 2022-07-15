import dayjs from "dayjs";
import { LessThan } from "typeorm";
import { AppDataSource } from "../../../configs/data-source";
import { AccessToken } from "../entities/access-token.entity";
import { getAccessToken } from "../../../utils/tuya-services";

(async () => {
  await AppDataSource.initialize();
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
    expire_date: dayjs().add(expire_time, "second").toDate(),
  });
  await newToken.save();
  console.log("access token has been created");
})();
