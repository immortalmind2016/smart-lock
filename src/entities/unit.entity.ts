import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Reservation } from "./reservation.entitiy";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field((type) => ID)
  id: number;

  @Column({ type: "text" })
  @Field()
  unit_name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.unit)
  reservations: Reservation[];
}
