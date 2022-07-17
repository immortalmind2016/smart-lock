import { locksData } from "../../src/data/locks";
import { unitsData } from "../../src/data/units";
import { Lock } from "../../src/modules/lock/entities/lock.entity";
import { Unit } from "../../src/modules/unit/entities/unit.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1658086400810 implements MigrationInterface {
  name = "initialMigration1658086400810";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lock" ("id" BIGSERIAL NOT NULL, "unit_id" bigint NOT NULL, "remote_lock_id" text NOT NULL, CONSTRAINT "UQ_c666ac2abb1edf40a84a264bb63" UNIQUE ("remote_lock_id"), CONSTRAINT "REL_8fce7b9fb7ee77b6bdcfd2a39d" UNIQUE ("unit_id"), CONSTRAINT "PK_b47095fc0260d85601062b8ed1d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "unit" ("id" BIGSERIAL NOT NULL, "unit_name" text NOT NULL, CONSTRAINT "UQ_2b7d9e98d5c89487750c5d227ef" UNIQUE ("unit_name"), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reservation" ("id" BIGSERIAL NOT NULL, "unit_id" bigint NOT NULL, "guest_name" text NOT NULL, "check_in" TIMESTAMP NOT NULL, "check_out" TIMESTAMP NOT NULL, "is_cancelled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "access_code" ("id" BIGSERIAL NOT NULL, "reservation_id" bigint NOT NULL, "passcode" character varying(7) NOT NULL, "remote_passcode_id" text NOT NULL, CONSTRAINT "REL_947c00621d71591b4851870e10" UNIQUE ("reservation_id"), CONSTRAINT "PK_31c26435c0d26a2ce6bee4a763b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "access_token" ("id" text NOT NULL, "token" text NOT NULL, "refresh_token" text NOT NULL, "expire_time" integer NOT NULL, "expire_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "lock" ADD CONSTRAINT "FK_8fce7b9fb7ee77b6bdcfd2a39dc" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_8c07cd30ca600a7941f2884be5c" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "access_code" ADD CONSTRAINT "FK_947c00621d71591b4851870e10b" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_code" DROP CONSTRAINT "FK_947c00621d71591b4851870e10b"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_8c07cd30ca600a7941f2884be5c"`
    );
    await queryRunner.query(
      `ALTER TABLE "lock" DROP CONSTRAINT "FK_8fce7b9fb7ee77b6bdcfd2a39dc"`
    );
    await queryRunner.query(`DROP TABLE "access_token"`);
    await queryRunner.query(`DROP TABLE "access_code"`);
    await queryRunner.query(`DROP TABLE "reservation"`);
    await queryRunner.query(`DROP TABLE "unit"`);
    await queryRunner.query(`DROP TABLE "lock"`);
  }
}
