import { Field, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Unit } from "./unit.entity";

@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: number;

  @Column({})
  unit_id: number;

  @ManyToOne(() => Unit, (unit) => unit.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "unit_id" })
  unit: Unit;

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
}
