import { FindOptionsWhere } from "typeorm";
import { accessCodeRepository } from "./access-code.repository";
import { AccessCode } from "./entities/access-code.entity";

type InputType = Pick<
  AccessCode,
  "passcode" | "remote_passcode_id" | "reservation_id"
>;
const findBy: (
  input: FindOptionsWhere<AccessCode>
) => Promise<AccessCode | null> = (input: FindOptionsWhere<AccessCode>) => {
  return accessCodeRepository.findOneBy(input);
};
const create = (input: InputType) => {
  const { passcode, remote_passcode_id, reservation_id } = input;
  return accessCodeRepository.create({
    passcode,
    remote_passcode_id,
    reservation_id,
  });
};

const updateRemotePassCode = (id: number, input: Partial<InputType>) => {
  const { passcode, remote_passcode_id, reservation_id } = input || {};
  return accessCodeRepository.updateBy(
    { reservation_id: id },
    {
      passcode,
      remote_passcode_id,
      reservation_id,
    }
  );
};
const findAndRemove = async (reservation_id: number) => {
  return accessCodeRepository.findAndRemove(reservation_id);
};

export const accessCodeService = {
  create,
  updateRemotePassCode,
  findBy,
  findAndRemove,
};
