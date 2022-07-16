import { AccessCode } from "./entities/access-code.entity";

const create = (
  input: Pick<AccessCode, "passcode" | "remote_passcode_id" | "reservation_id">
) => {
  const { passcode, remote_passcode_id, reservation_id } = input;
  const accessCode = AccessCode.create({
    passcode,
    remote_passcode_id,
    reservation_id,
  });
  return accessCode.save();
};
export const accessCodeService = { create };
