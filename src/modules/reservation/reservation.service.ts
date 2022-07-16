import envConfig from "../../configs/env-config";
import { TempPasswordRequestBody } from "types";
import { redisClient } from "../../utils/redis-client";
import { generateTempPassword, getDeviceInfo } from "../../utils/tuya-services";
import { encrypt } from "./child-process/encrypting-password";
import { Reservation } from "./entities/reservation.entity";
import { reservationRepository } from "./reservation.repository";
import {
  generatePassword,
  redisDeviceLocalKey,
  redistAccessToken,
  setDeviceLocalKeyInRedis,
} from "./utils";
import dayjs from "dayjs";
import { accessCodeService } from "../../modules/access-code/access-code.service";

const create = async (
  input: Pick<
    Reservation,
    "unit_id" | "guest_name" | "check_in" | "check_out"
  > & { remote_lock_id: string }
) => {
  //create reservation and get access token to use it for creating the temp password
  const [reservation, access_token] = await Promise.all([
    reservationRepository.create(input),
    redistAccessToken(),
  ]);

  const { check_in, check_out, guest_name } = reservation || {};

  //get device info in order to catch the

  const { remote_lock_id: deviceId } = input || {};

  if (!deviceId) {
    throw new Error("device id is not provided");
  }
  const deviceLocalKey = await redisDeviceLocalKey(deviceId);

  if (!deviceLocalKey) {
    const deviceInfo = await getDeviceInfo(access_token.token, deviceId);

    await setDeviceLocalKeyInRedis(deviceId, deviceInfo.local_key);
  }

  // create temp password for this reservation using the access token
  const passcode = String(generatePassword());
  const password = encrypt(
    String(generatePassword()),
    deviceLocalKey || ""
  )?.content;

  const body: TempPasswordRequestBody = {
    effective_time: dayjs(check_in).unix(),
    invalid_time: dayjs(check_in).unix(),
    name: `reservation-${guest_name}`,
    password,
  };

  // const tempPassword = await generateTempPassword(
  //   access_token?.token,
  //   deviceId,
  //   body
  // );
  const remote_passcode_id = "13124312";
  accessCodeService.create({
    passcode,
    remote_passcode_id,
    reservation_id: reservation.id,
  });
  return reservationRepository.create(input);
};

export const reservationService = {
  create,
};
