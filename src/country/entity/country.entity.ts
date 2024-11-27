import { Clients } from "src/client/entity/client.entity";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Companies } from "src/company/entity/company.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: TABLE_NAMES.COUNTRY })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => Clients, (client) => client.country, { eager: false })
  clients: Clients[];

  @OneToMany(() => Companies, (company) => company.country, { eager: false })
  companies: Companies[];
}
