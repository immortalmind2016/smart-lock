import { AccessCodeActions, ReservationStatus } from "../../types";
import { removeGeneratedTempPasswordMocked } from "../../utils/tuya-services";
import { reservationRepository } from "./reservation.repository";
import { accessCodeService } from "../../modules/access-code/access-code.service";
import { Reservation } from "./entities/reservation.entity";
import { accessCodesQueue } from "../../background-jobs/generate-access-code";

type InputType = Pick<
  Reservation,
  "unit_id" | "guest_name" | "check_in" | "check_out"
> & { remote_lock_id: string; status?: ReservationStatus };
const create = async (input: InputType) => {
  const reservation = await reservationRepository.create(input);

  const { check_in, check_out, guest_name, id } = reservation || {};
  const { remote_lock_id } = input || {};
  //Run background process
  accessCodesQueue.add(AccessCodeActions.CREATE, {
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
      is_cancelled
        ? AccessCodeActions.UPDATE_CANCELLED
        : AccessCodeActions.UPDATE_NOT_CANCELLED,
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
        status: ReservationStatus.PENDING,
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
    const { remote_passcode_id } = accessCode || {};
    // remove the old access key
    if (remote_lock_id) {
      accessCodesQueue.add(AccessCodeActions.CANCELLED, {
        remote_passcode_id,
        accessCode,
        id,
      });
    }

    return reservation;
  } catch (e) {
    console.error(e);
    throw new Error(`cannot remove the reservation with id ${id}`);
  }
};
export const list = () => reservationRepository.list();
const remove = (id: number) => reservationRepository.remove(id);
export const updateStatusById = (id: number, status: ReservationStatus) =>
  reservationRepository.updateStatusById(id, status);

export const reservationService = {
  create,
  update,
  cancel,
  list,
  remove,
  updateStatusById,
};
