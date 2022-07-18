import { MigrationInterface, QueryRunner } from "typeorm";

export class status1658107527007 implements MigrationInterface {
  name = "status1658107527007";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reservation_status_enum" AS ENUM('PENDING', 'CREATED', 'UPDATED')`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'PENDING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
  }
}
