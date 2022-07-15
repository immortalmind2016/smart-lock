import { Column, PrimaryGeneratedColumn, Entity, BaseEntity } from "typeorm";

@Entity({ name: "access_token" })
export class AccessToken extends BaseEntity {
  @Column({ type: "text", primary: true, nullable: false })
  id: string;

  @Column({ type: "text" })
  token: string;

  @Column({ type: "text" })
  refresh_token: string;

  //in seconds
  @Column({ type: "int" })
  expire_time: number;

  @Column({ type: "timestamp" })
  expire_date: Date;

  @Column({ type: "timestamp" })
  created_at: Date;
}
