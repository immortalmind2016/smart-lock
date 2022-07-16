import { unitsData } from "../data/units";
import { Lock } from "../modules/lock/entities/lock.entity";
import { Unit } from "../modules/unit/entities/unit.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import { locksData } from "../data/locks";

export class seedUnitAndLock1657993091274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
