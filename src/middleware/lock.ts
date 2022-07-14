import { Lock } from "../entities/lock.entitiy";
import { MiddlewareFn } from "type-graphql";

export const hasLock: MiddlewareFn = async ({ args }, next) => {
  const lock = await Lock.findOneBy({ id: args.unitID });

  if (!lock) {
    throw new Error(
      "cannot use this mutation, because there's no lock entity attached to it"
    );
  }
  return next();
};
