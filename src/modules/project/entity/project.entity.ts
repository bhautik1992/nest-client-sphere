import {
  BillingType,
  CurrencyType,
  ProjectStatus,
} from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.PROJECT })
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "enum", enum: Object.values(ProjectStatus), nullable: false })
  status: ProjectStatus;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: "enum", enum: Object.values(BillingType), nullable: false })
  billingType: BillingType;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  hourlyMonthlyRate: number;

  @Column({ type: "int", default: 0 })
  projectHours: number;

  @Column({ type: "enum", enum: Object.values(CurrencyType), nullable: false })
  currency: CurrencyType;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: "int", nullable: false })
  clientId: number;

  @ManyToOne(() => Clients, (client) => client.projects, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Clients;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
