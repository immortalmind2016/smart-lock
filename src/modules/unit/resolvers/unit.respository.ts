import { Unit } from "../entities/unit.entity";

const find = () => Unit.find({});
const create = (input: Partial<Unit>) => {
  const unit = Unit.create(input);
  return Unit.save(unit);
};
export const unitRepository = {
  create,
  find,
};
