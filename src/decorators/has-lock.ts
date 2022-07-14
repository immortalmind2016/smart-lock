import { Lock } from "../modules/lock/entities/lock.entity";
import { createMethodDecorator } from "type-graphql";

export function HasLock() {
  return createMethodDecorator(async ({ args }, next) => {
    const lock = await Lock.findOneBy({ id: args.unitID });

    if (!lock) {
      throw new Error(
        "cannot use this mutation, because there's no lock entity attached to it"
      );
    }
    return next();
  });
}
