import LockSeeder from "seeds/lock";
import { runSeeder } from "typeorm-seeding";

export default async () => {
  await runSeeder(LockSeeder);
};
