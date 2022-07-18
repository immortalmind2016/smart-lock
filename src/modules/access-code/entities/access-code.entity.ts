import { Field, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  BaseEntity,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Reservation } from "../../reservation/entities/reservation.entity";

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

  @Column({ type: "varchar", length: 7 })
  @Field()
  passcode: string;

  @Column({ type: "text" })
  @Field()
  remote_passcode_id: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
    type: "timestamp",
  })
  @Field()
  created_at: Date;
}
