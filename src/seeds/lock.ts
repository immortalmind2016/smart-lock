import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { locksData } from "../data/locks";
import { Lock } from "../entities/lock.entitiy";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Lock)
      .values(locksData)
      .execute();
  }
}
