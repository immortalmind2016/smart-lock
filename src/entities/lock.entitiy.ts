import { Field, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { Unit } from "./unit.entity";

@ObjectType()
@Entity()
export class Lock extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: number;

  @Column({ type: "bigint" })
  unit_id: number;

  @OneToOne(() => Unit, (unit) => unit.lock, { onDelete: "CASCADE" })
  @JoinColumn({ name: "unit_id" })
  unit: Unit;

  //external device id
  @Column({ type: "text" })
  @Field()
  remote_lock_id: string;
}
