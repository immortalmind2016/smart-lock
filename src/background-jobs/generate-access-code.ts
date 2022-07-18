import { QueueEvents, Queue } from "bullmq";

import { reservationService } from "../modules/reservation/reservation.service";
import envConfig from "../configs/env-config";

const { REDIS_HOST, REDIS_PORT } = envConfig;

export const accessCodesQueue = new Queue("access-code", {
  connection: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
export const accessCodesQueueEvents = new QueueEvents("access-code", {
  connection: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

accessCodesQueueEvents.on("completed", ({ returnvalue }) => {
  console.log("access code has been successfully create ", { returnvalue });
});

accessCodesQueueEvents.on("failed", async ({ failedReason }) => {
  try {
    const data = JSON.parse(failedReason);
    const { action, reason } = data || {};
    const reasonData = JSON.parse(reason);
    if (action == "CREATE") {
      //remove reservation  we can't create the access code on creation only [ We can change this behavior based on the business requirements]
      await reservationService.remove(reasonData?.id);
    }
  } catch (e) {
    console.log(e);
  }
});
