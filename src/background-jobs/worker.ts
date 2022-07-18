import { Worker } from "bullmq";
import envConfig from "../configs/env-config";

import { accessCodeService } from "../modules/access-code/access-code.service";
import { generateAccessCode, removeGeneratedAccessCode } from "./utills";
const { REDIS_HOST, REDIS_PORT } = envConfig;

new Worker(
  "access-code",
  async ({ data, name }) => {
    try {
      const input = data || {};
      const { id: reservation_id, remote_lock_id } = input;
      let passcode, remote_passcode_id;
      if (name == "UPDATE-NOT-CANCELLED") {
        removeGeneratedAccessCode(reservation_id, remote_lock_id);
      }
      const generatedAccessCode = (await generateAccessCode(input)) || {};
      passcode = generatedAccessCode.passcode;
      remote_passcode_id = generatedAccessCode.remote_passcode_id;

      if (name == "UPDATE-NOT-CANCELLED") {
        await accessCodeService.updateRemotePassCode(reservation_id, {
          remote_passcode_id,
          passcode,
        });
      } else {
        await accessCodeService.create({
          passcode,
          remote_passcode_id,
          reservation_id,
        });
      }

      return { passcode, remote_passcode_id, reservation_id };
    } catch (e: any) {
      throw new Error(JSON.stringify({ action: name, reason: e.message }));
    }
  },
  {
    connection: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  }
);
