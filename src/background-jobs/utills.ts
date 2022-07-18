import dayjs from "dayjs";
import { promisify } from "util";
import workerFarm from "worker-farm";
import path from "path";
import {
  generatePassword,
  redisDeviceLocalKey,
  setDeviceLocalKeyInRedis,
} from "../modules/reservation/utils";
import { TempPasswordRequestBody } from "../types";
import {
  generateTempPasswordMocked,
  getDeviceInfoMock,
  removeGeneratedTempPasswordMocked,
} from "../utils/tuya-services";
import { accessCodeService } from "../modules/access-code/access-code.service";

let workers = workerFarm(
  require.resolve(
    path.join(__dirname, "..", "child-process", "encrypting-password.js")
  )
);

const encryptPassword: any = promisify(workers);

// generate access code using device local key
export const generateAccessCode = async (input) => {
  const {
    remote_lock_id: deviceId,
    check_in,
    check_out,
    guest_name,
    id,
  } = input || {};

  console.log({ deviceId });
  if (!deviceId) {
    throw new Error(JSON.stringify(input, null, 2));
  }
  //get device local_key in order to encrypt the password everytime we want without make many unneeded request

  const deviceLocalKey = await redisDeviceLocalKey(deviceId);

  if (!deviceLocalKey) {
    const deviceInfo = await getDeviceInfoMock(deviceId);

    await setDeviceLocalKeyInRedis(deviceId, deviceInfo.local_key);
  }

  // create temp password for this reservation using the access token
  const passcode = String(generatePassword());

  const password = (
    await encryptPassword(
      `${String(generatePassword())}#${deviceLocalKey || ""}`
    )
  )?.content;

  const body: TempPasswordRequestBody = {
    effective_time: dayjs(check_in).unix(),
    invalid_time: dayjs(check_in).unix(),
    name: `reservation-${guest_name}`,
    password,
  };

  const tempPassword = await generateTempPasswordMocked(deviceId, body);

  const remote_passcode_id = tempPassword.id;

  return {
    passcode,
    remote_passcode_id,
    reservation_id: id,
  };
};

export const removeGeneratedAccessCode = async (
  id: number,
  remote_lock_id: string
) => {
  const accessCode = await accessCodeService.findBy({
    reservation_id: id,
  });
  let remote_passcode_id = accessCode?.remote_passcode_id;

  // remove the old access key
  if (!remote_passcode_id) {
    throw new Error("This reservation doesn't attached to any access code");
  }

  await removeGeneratedTempPasswordMocked(
    remote_lock_id,
    remote_passcode_id as string
  );
};