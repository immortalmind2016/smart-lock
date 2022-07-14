import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  BaseEntity,
  OneToOne,
  AfterInsert,
} from "typeorm";
import { Reservation } from "./reservation.entitiy";
import { Field, ID, ObjectType } from "type-graphql";
import { Lock } from "./lock.entitiy";

@ObjectType()
@Entity()
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field((type) => ID)
  id: number;

  @Column({ type: "text", unique: true })
  @Field()
  unit_name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.unit)
  reservations?: Reservation[];

  @OneToOne(() => Lock, (lock) => lock.unit)
  lock?: Lock;
}
