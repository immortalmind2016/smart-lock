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
import { ReservationStatus } from "../../../types";
import { AccessCode } from "../../access-code/entities/access-code.entity";
import { Unit } from "../../unit/entities/unit.entity";

@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: number;

  @Column({ type: "bigint" })
  unit_id: number;

  @ManyToOne(() => Unit, (unit) => unit.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "unit_id" })
  unit: Unit;

  @OneToOne(() => AccessCode, (accessCode) => accessCode.reservation)
  accessCode: Reservation;

  @Column({ type: "text" })
  @Field()
  guest_name: string;

  @Column({ type: "timestamp" })
  @Field()
  check_in: Date;

  @Column({ type: "timestamp" })
  @Field()
  check_out: Date;

  @Column({ type: "boolean", default: false })
  @Field()
  is_cancelled: boolean;

  @Column({
    type: "enum",
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  @Field()
  status?: ReservationStatus;
}
