import { Field, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { Reservation } from "./reservation.entitiy";
import { Unit } from "./unit.entity";

@ObjectType()
@Entity({ name: "access_code" })
export class AccessCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: number;

  @Column({ type: "bigint" })
  reservation_id: number;

  @OneToOne(() => Reservation, (reservation) => reservation.accessCode, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reservation_id" })
  reservation: Reservation;

  @Column({ type: "text" })
  @Field()
  remote_lock_id: string;

  @Column({ type: "varchar", length: 6 })
  @Field()
  passcode: string;

  @Column({ type: "text" })
  @Field()
  remote_passcode_id: string;
}
