import { FindOptionsWhere } from "typeorm";
import { AccessCode } from "./entities/access-code.entity";

type InputType = Pick<
  AccessCode,
  "passcode" | "remote_passcode_id" | "reservation_id"
>;
const findBy: (
  input: FindOptionsWhere<AccessCode>
) => Promise<AccessCode | null> = (input: FindOptionsWhere<AccessCode>) => {
  return AccessCode.findOneBy(input);
};
const create = (input: InputType) => {
  const { passcode, remote_passcode_id, reservation_id } = input;
  const accessCode = AccessCode.create({
    passcode,
    remote_passcode_id,
    reservation_id,
  });
  return accessCode.save();
};

const updateRemotePassCode = (id: number, input: Partial<InputType>) => {
  const { passcode, remote_passcode_id, reservation_id } = input;
  return AccessCode.update(id, {
    passcode,
    remote_passcode_id,
    reservation_id,
  });
};

export const accessCodeService = { create, updateRemotePassCode, findBy };
