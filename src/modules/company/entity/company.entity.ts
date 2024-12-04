import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: TABLE_NAMES.COMPANY })
export class Companies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  countryCode: string;

  @Column({ nullable: false })
  stateCode: string;

  @Column({ nullable: false })
  cityName: string;

  @OneToMany(() => Clients, (client) => client.company)
  clients: Clients[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
