import { Unit } from "../entities/unit.entity";
import { unitRepository } from "./unit.respository";

const find = () => unitRepository.find();
const create = (input: Partial<Unit>) => unitRepository.create(input);
export const unitService = {
  create,
  find,
};
