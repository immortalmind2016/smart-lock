import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  BaseEntity,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Field, ID, ObjectType } from "type-graphql";
import { Lock } from "../../lock/entities/lock.entity";

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

  @CreateDateColumn({
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
    type: "timestamp",
  })
  created_at: Date;
}
