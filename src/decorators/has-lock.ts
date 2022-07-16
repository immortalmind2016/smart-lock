import { Lock } from "../modules/lock/entities/lock.entity";
import { createMethodDecorator } from "type-graphql";
import { Context } from "types";

export function UseLock() {
  return createMethodDecorator<Context>(async ({ args, context }, next) => {
    const lock = await Lock.findOneBy({ unit_id: args.unitID });
    context.lockData = lock;
    if (!lock) {
      throw new Error(
        "cannot use this mutation, because there's no lock entity attached to it"
      );
    }
    return next();
  });
}
