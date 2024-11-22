import { Clients } from "src/client/entity/client.entity";
import { ProjectStatus } from "src/common/constants/enum.constant";
import { Companies } from "src/company/entity/company.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";

@Entity({ name: TABLE_NAMES.PROJECT })
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "enum", enum: ProjectStatus, nullable: false })
  status: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => Clients, (client) => client.projects, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Clients;

  @ManyToOne(() => Companies, (company) => company.projects, {
    nullable: false,
  })
  @JoinColumn({ name: "companyId" })
  company: Companies;

  @Column({ type: "int", nullable: false })
  clientId: number;

  @Column({ type: "int", nullable: false })
  companyId: number;
}
