import envConfig from "../../configs/env-config";
import { TempPasswordRequestBody } from "../../types";
import {
  generateTempPasswordMocked,
  getDeviceInfo,
  removeGeneratedTempPasswordMocked,
} from "../../utils/tuya-services";
import { reservationRepository } from "./reservation.repository";
import {
  generatePassword,
  redisDeviceLocalKey,
  setDeviceLocalKeyInRedis,
} from "./utils";
import dayjs from "dayjs";
import { accessCodeService } from "../../modules/access-code/access-code.service";
import { Reservation } from "./entities/reservation.entity";
import workerFarm from "worker-farm";
import path from "path";
import { promisify } from "util";

let workers = workerFarm(
  require.resolve(
    path.join(__dirname, "child-process", "encrypting-password.js")
  )
);
const encryptPassword: any = promisify(workers);

// generate access code using device local key and save it inside access code
const generateAccessCode = async (input) => {
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
    const deviceInfo = await getDeviceInfo(deviceId);

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

  const tempPassword = await generateTempPasswordMocked(deviceId, body);

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
  const reservation = await reservationRepository.create(input);

  const { check_in, check_out, guest_name, id } = reservation || {};
  const { remote_lock_id } = input || {};
  try {
    const { passcode, remote_passcode_id } =
      (await generateAccessCode({
        remote_lock_id,
        check_in,
        check_out,
        guest_name,
        id,
      })) || {};

    await accessCodeService.create({
      passcode,
      remote_passcode_id,
      reservation_id: id,
    });
  } catch (e: any) {
    //reverse the changes as DB transaction but manually
    await reservationRepository.remove(reservation?.id);
    throw new Error(
      `cannot create reservation with access code due too : ${e.message}`
    );
  }

  return reservation;
};

export const update = async (id: number, input: InputType) => {
  const { unit_id, guest_name, check_in, check_out, remote_lock_id } =
    input ?? {};

  //find reservation and get access token to use it to create the temp password
  const reservation = await reservationRepository.findOneBy({ id });
  const is_cancelled = reservation?.is_cancelled;

  if (!reservation) {
    throw new Error("NotFound Reservation");
  }
  try {
    //assume if we are going to update a reservation so is cancelled will be false
    let passcode, remote_passcode_id;
    if (is_cancelled) {
      const generatedAccessCode =
        (await generateAccessCode({
          remote_lock_id,
          check_in,
          check_out,
          guest_name,
          id,
        })) || {};
      remote_passcode_id = generatedAccessCode.remote_passcode_id;
      passcode = generatedAccessCode.passcode;
    } else {
      const data = await accessCodeService.findBy({
        reservation_id: reservation?.id,
      });
      remote_passcode_id = data?.remote_passcode_id;

      // remove the old access key
      if (!remote_passcode_id) {
        throw new Error("This reservation doesn't attached to any access code");
      }

      await removeGeneratedTempPasswordMocked(
        remote_lock_id,
        remote_passcode_id as string
      );
    }

    Object.assign(reservation, {
      unit_id,
      guest_name,
      check_in,
      check_out,
      is_cancelled: false,
    });

    //save the reservation with new updates , generate new access code with new dates and get save the new remote lock id
    const [updatedReservation, generatedAccessCodeData] = await Promise.all([
      reservation.save(),
      generateAccessCode({
        remote_lock_id,
        check_in,
        check_out,
        guest_name,
        id,
      }),
    ]);
    if (is_cancelled) {
      await accessCodeService.create({
        reservation_id: reservation.id,
        remote_passcode_id: generatedAccessCodeData.remote_passcode_id,
        passcode,
      });
    } else
      await accessCodeService.updateRemotePassCode(reservation.id, {
        remote_passcode_id: generatedAccessCodeData.remote_passcode_id,
      });
    return updatedReservation;
  } catch (e: any) {
    throw new Error(
      `cannot update the reservation due too the following reason : ${e.message}`
    );
  }
};
const cancel = async (id: number, remote_lock_id: string) => {
  try {
    const [reservation, accessCode] = await Promise.all([
      reservationRepository.cancel(id),
      accessCodeService.findAndRemove(id),
    ]);
    const { remote_passcode_id } = accessCode || {};
    // remove the old access key
    if (remote_lock_id) {
      await removeGeneratedTempPasswordMocked(
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
export const list = () => reservationRepository.list();
export const reservationService = {
  create,
  update,
  cancel,
  list,
};
