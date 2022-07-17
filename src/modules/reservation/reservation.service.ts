import envConfig from "../../configs/env-config";
import { TempPasswordRequestBody } from "types";
import { redisClient } from "../../utils/redis-client";
import {
  generateTempPassword,
  getDeviceInfo,
  removeGeneratedTempPassword,
} from "../../utils/tuya-services";
import { reservationRepository } from "./reservation.repository";
import {
  generatePassword,
  redisDeviceLocalKey,
  redistAccessToken,
  setDeviceLocalKeyInRedis,
} from "./utils";
import dayjs from "dayjs";
import { accessCodeService } from "../../modules/access-code/access-code.service";
import { AppDataSource } from "configs/data-source";
import { Reservation } from "./entities/reservation.entity";
import workfarm from "worker-farm";
import path from "path";
import { promisify } from "util";

var workerFarm = require("worker-farm"),
  workers = workerFarm(
    require.resolve(
      path.join(__dirname, "child-process", "encrypting-password.js")
    )
  );
console.log("🚀 ~ file: reservation.service.ts ~ line 30 ~ workers", workers);
const encryptPassword = promisify(workers);

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

  const password = (
    await encryptPassword(
      `${String(generatePassword())}#${deviceLocalKey || ""}`
    )
  )?.content;

  const body: TempPasswordRequestBody = {
    effective_time: dayjs(check_in).unix(),
    invalid_time: dayjs(check_in).unix(),
    name: `reservation-${guest_name}`,
    password,
  };

  const tempPassword = await generateTempPassword(access_token, deviceId, body);
  const remote_passcode_id = tempPassword.id;

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
  const { passcode, remote_passcode_id } =
    (await generateAccessCode(
      { remote_lock_id, check_in, check_out, guest_name, id },
      access_token?.token
    )) || {};
  await accessCodeService.create({
    passcode,
    remote_passcode_id,
    reservation_id: id,
  });

  return reservation;
};

export const update = async (id: number, input: InputType) => {
  const { unit_id, guest_name, check_in, check_out, remote_lock_id } =
    input ?? {};

  //find reservation and get access token to use it to create the temp password
  const [reservation, access_token] = await Promise.all([
    reservationRepository.findOneBy({ id }),
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
  const { remote_passcode_id } =
    (await accessCodeService.findBy({
      reservation_id: reservation.id,
    })) || {};

  // remove the old access key
  if (remote_lock_id) {
    await removeGeneratedTempPassword(
      access_token?.token,
      remote_lock_id,
      remote_passcode_id as string
    );
  }

  //save the reservation with new updates , generate new access code with new dates and get save the new remote lock id
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
const cancel = async (id: number, remote_lock_id: string) => {
  try {
    const [reservation, access_token] = await Promise.all([
      reservationRepository.cancel(id),
      redistAccessToken(),
    ]);

    const { remote_passcode_id } =
      (await accessCodeService.findBy({
        reservation_id: id,
      })) || {};

    // remove the old access key
    if (remote_lock_id) {
      await removeGeneratedTempPassword(
        access_token?.token,
        remote_lock_id,
        remote_passcode_id as string
      );
    }
    return reservation;
  } catch (e) {
    console.error(e);
    throw new Error(`cannot remove the reservation with id ${id}`);
  }
};
export const reservationService = {
  create,
  update,
  cancel,
};
