import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { locksData } from "../data/locks";
import { Lock } from "../modules/lock/entities/lock.entity";

export default class LockSeeder implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await Lock.createQueryBuilder()
      .insert()
      .into(Lock)
      .values(locksData)
      .execute();
  }
}
