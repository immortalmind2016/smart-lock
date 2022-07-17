import { unitsData } from "../data/units";
import { Unit } from "../modules/unit/entities/unit.entity";
import { Factory, Seeder } from "typeorm-seeding";
import { locksData } from "../../src/data/locks";
import { Lock } from "../../src/modules/lock/entities/lock.entity";

export default class UnitLockSeeder implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await Unit.createQueryBuilder()
      .insert()
      .into(Unit)
      .values(unitsData)
      .execute();

    await Lock.createQueryBuilder()
      .insert()
      .into(Lock)
      .values(locksData)
      .execute();
  }
}
