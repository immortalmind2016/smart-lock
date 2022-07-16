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

// generate access code using device local key and save it inside access code
const generateAccessCode = async (input, access_token: string) => {
  const {
    remote_lock_id: deviceId,
    check_in,
    check_out,
    guest_name,
    id,
  } = input || {};

  if (!deviceId) {
    throw new Error("device id is not provided");
  }
  //get device local_key in order to catch the

  const deviceLocalKey = await redisDeviceLocalKey(deviceId);

  if (!deviceLocalKey) {
    const deviceInfo = await getDeviceInfo(access_token, deviceId);

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

  return {
    passcode,
    remote_passcode_id,
    reservation_id: id,
  };
};
type InputType = Pick<
  Reservation,
  "unit_id" | "guest_name" | "check_in" | "check_out"
> & { remote_lock_id: string };
const create = async (input: InputType) => {
  //create reservation and get access token to use it to create the temp password
  const [reservation, access_token] = await Promise.all([
    reservationRepository.create(input),
    redistAccessToken(),
  ]);

  const { check_in, check_out, guest_name, id } = reservation || {};
  const { remote_lock_id } = input || {};

  const { passcode, remote_passcode_id, reservation_id } =
    (await generateAccessCode(
      { remote_lock_id, check_in, check_out, guest_name, id },
      access_token?.token
    )) || {};

  await accessCodeService.create({
    passcode,
    remote_passcode_id,
    reservation_id: id,
  });

  return reservationRepository.create(input);
};

export const update = async (id: number, input: InputType) => {
  const { unit_id, guest_name, check_in, check_out, remote_lock_id } =
    input ?? {};

  //find reservation and get access token to use it to create the temp password
  const [reservation, access_token] = await Promise.all([
    Reservation.findOneBy({ id }),
    redistAccessToken(),
  ]);

  if (!reservation) {
    throw new Error("NotFound Reservation");
  }

  Object.assign(reservation, {
    unit_id,
    guest_name,
    check_in,
    check_out,
  });

  const [updatedReservation, generatedAccessCodeData] = await Promise.all([
    reservation.save(),
    generateAccessCode(
      { remote_lock_id, check_in, check_out, guest_name, id },
      access_token?.token
    ),
  ]);
  await accessCodeService.updateRemotePassCode(reservation.id, {
    remote_passcode_id: generatedAccessCodeData.remote_passcode_id,
  });
  return updatedReservation;
};

export const reservationService = {
  create,
  update,
};
