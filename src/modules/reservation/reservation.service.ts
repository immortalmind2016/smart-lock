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
import { accessCodesQueue } from "../../background-jobs/generate-access-code";

type InputType = Pick<
  Reservation,
  "unit_id" | "guest_name" | "check_in" | "check_out"
> & { remote_lock_id: string };
const create = async (input: InputType) => {
  //create reservation and get access token to use it to create the temp password
  const reservation = await reservationRepository.create(input);

  const { check_in, check_out, guest_name, id } = reservation || {};
  const { remote_lock_id } = input || {};
  accessCodesQueue.add("CREATE", {
    remote_lock_id,
    check_in,
    check_out,
    guest_name,
    id,
  });

  return reservation;
};

export const update = async (id: number, input: InputType) => {
  const { unit_id, guest_name, check_in, check_out, remote_lock_id } =
    input ?? {};

  const reservation = await reservationRepository.findOneBy({ id });
  const is_cancelled = reservation?.is_cancelled;

  if (!reservation) {
    throw new Error("NotFound Reservation");
  }
  try {
    //if update cancelled reservation so set it to false and create new access code entity in our db
    //else remove the Tuya access code and update the entity in our db
    //background job update
    accessCodesQueue.add(
      is_cancelled ? "UPDATE-CANCELLED" : "UPDATE-NOT-CANCELLED",
      {
        check_in,
        check_out,
        guest_name,
        id,
        remote_lock_id,
      }
    );

    return reservationRepository.updateBy(
      { id: reservation.id },
      {
        unit_id,
        guest_name,
        check_in,
        check_out,
        is_cancelled: false,
      }
    );
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
    console.log("CANCEL");
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
const remove = (id: number) => reservationRepository.remove(id);
export const reservationService = {
  create,
  update,
  cancel,
  list,
  remove,
};
