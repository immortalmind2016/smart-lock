import { MigrationInterface, QueryRunner } from "typeorm";

export class statusCancelled1658135922869 implements MigrationInterface {
  name = "statusCancelled1658135922869";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."reservation_status_enum" RENAME TO "reservation_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reservation_status_enum" AS ENUM('PENDING', 'CREATED', 'UPDATED', 'CANCELLED')`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" TYPE "public"."reservation_status_enum" USING "status"::"text"::"public"."reservation_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" SET DEFAULT 'PENDING'`
    );
    await queryRunner.query(`DROP TYPE "public"."reservation_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reservation_status_enum_old" AS ENUM('PENDING', 'CREATED', 'UPDATED')`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" TYPE "public"."reservation_status_enum_old" USING "status"::"text"::"public"."reservation_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ALTER COLUMN "status" SET DEFAULT 'PENDING'`
    );
    await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."reservation_status_enum_old" RENAME TO "reservation_status_enum"`
    );
  }
}
