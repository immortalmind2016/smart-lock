import { FindOptionsWhere, In } from "typeorm";
import { convertToDataloaderResult } from "../../utils/graphql/convert-to-dataloader-results";
import { dataLoaderFactory } from "../../utils/graphql/dataloader-factory";
import { Reservation } from "./entities/reservation.entity";

const reservationLoader = dataLoaderFactory<number, Reservation>(
  async (ids) => {
    const reservations = await Reservation.find({
      where: { id: In(ids as number[]) },
    });
    return convertToDataloaderResult(ids, reservations, "id");
  }
);

const create = (
  input: Pick<Reservation, "unit_id" | "guest_name" | "check_in" | "check_out">
) => {
  const reservation = Reservation.create({ ...input });
  return reservation.save();
};
const remove = (id: number) => Reservation.delete({ id });
const findOneBy: (
  input: FindOptionsWhere<Reservation>
) => Promise<Reservation | null> = (input: FindOptionsWhere<Reservation>) => {
  return Reservation.findOneBy(input);
};
const findById: (id: number) => Promise<Reservation | null> = async (
  id: number
) => {
  const data = await reservationLoader.load(id);
  return data;
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
const list = () => Reservation.find({});
export const reservationRepository = {
  create,
  findOneBy,
  cancel,
  remove,
  list,
  findById,
};
