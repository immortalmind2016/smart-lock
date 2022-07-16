import { Reservation } from "./entities/reservation.entity";

const create = (
  input: Pick<Reservation, "unit_id" | "guest_name" | "check_in" | "check_out">
) => {
  const reservation = Reservation.create({ ...input });
  return reservation.save();
};
export const reservationRepository = {
  create,
};
