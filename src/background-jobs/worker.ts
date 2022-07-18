import { Worker } from "bullmq";
import envConfig from "../configs/env-config";

import { accessCodeService } from "../modules/access-code/access-code.service";
import { reservationService } from "../modules/reservation/reservation.service";
import { AccessCodeActions, ReservationStatus } from "../types";
import { removeGeneratedTempPasswordMocked } from "../utils/tuya-services";
import { generateAccessCode, removeGeneratedAccessCode } from "./utills";
const { REDIS_HOST, REDIS_PORT } = envConfig;

const updateReservationStatusByAction = (id: number) => ({
  [AccessCodeActions.CREATE]: () =>
    reservationService.updateStatusById(id, ReservationStatus.CREATED),
  [AccessCodeActions.UPDATE_NOT_CANCELLED]: () =>
    reservationService.updateStatusById(id, ReservationStatus.UPDATED),
  [AccessCodeActions.CANCELLED]: () =>
    reservationService.updateStatusById(id, ReservationStatus.CANCELLED),
  [AccessCodeActions.UPDATE_CANCELLED]: () =>
    reservationService.updateStatusById(id, ReservationStatus.UPDATED),
});

export const AccessCodesWorker = new Worker(
  "access-code",
  async ({ data, name }) => {
    try {
      const input = data || {};
      const { id: reservation_id, remote_lock_id } = input;
      if (name == AccessCodeActions.CANCELLED) {
        await removeGeneratedTempPasswordMocked(
          remote_lock_id,
          input?.remote_passcode_id as string
        );

        await updateReservationStatusByAction(reservation_id)[name]?.();
        return;
      }
      //if not cancelled so it has an access code inside Tuya, so remove it
      if (name == AccessCodeActions.UPDATE_NOT_CANCELLED) {
        removeGeneratedAccessCode(reservation_id, remote_lock_id);
      }
      //Generating access code from Tuya
      const { passcode, remote_passcode_id } =
        (await generateAccessCode(input)) || {};

      //if not cancelled so it has an access code inside our db, so update it
      //else create new one
      if (name == AccessCodeActions.UPDATE_NOT_CANCELLED) {
        await accessCodeService.updateRemotePassCode(reservation_id, {
          remote_passcode_id,
          passcode,
        });
      } else {
        await accessCodeService.create({
          passcode,
          remote_passcode_id,
          reservation_id,
        });
      }
      await updateReservationStatusByAction(reservation_id)[name]?.();

      return { passcode, remote_passcode_id, reservation_id };
    } catch (e: any) {
      throw new Error(JSON.stringify({ action: name, reason: e.message }));
    }
  },
  {
    connection: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  }
);
