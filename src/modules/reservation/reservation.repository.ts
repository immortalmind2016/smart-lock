import { DeleteResult, FindOptionsWhere } from "typeorm";
import { Reservation } from "./entities/reservation.entity";

const create = (
  input: Pick<Reservation, "unit_id" | "guest_name" | "check_in" | "check_out">
) => {
  const reservation = Reservation.create({ ...input });
  return reservation.save();
};
const findOneBy: (
  input: FindOptionsWhere<Reservation>
) => Promise<Reservation | null> = (input: FindOptionsWhere<Reservation>) => {
  return Reservation.findOneBy(input);
};
const cancel: (id: number) => Promise<Reservation | null> = async (
  id: number
) => {
  let reservation = await Reservation.findOneBy({ id });
  if (!reservation) {
    return null;
  }
  Object.assign(reservation, { is_cancelled: true });
  return reservation.save();
};
export const reservationRepository = {
  create,
  findOneBy,
  cancel,
};
