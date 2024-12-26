import {
  BillingType,
  CrStatus,
  CurrencyType,
  InvoicePaymentCycle,
} from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Vendors } from "src/modules/vendor/entity/vendor.entity";
import { Invoices } from "src/modules/invoice/entity/invoice.entity";
import { Projects } from "src/modules/project/entity/project.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.CR })
export class Crs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "enum", enum: Object.values(CrStatus), nullable: false })
  status: CrStatus;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: "int", nullable: false })
  assignFromCompanyId: number;

  @ManyToOne(() => Vendors, (company) => company.assignedFromProjects, {
    nullable: false,
  })
  @JoinColumn({ name: "assignFromCompanyId" })
  assignFromCompany: Vendors;

  @Column({ type: "int", nullable: false })
  clientId: number;

  @ManyToOne(() => Clients, (client) => client.projects, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Clients;

  @Column({ type: "int", nullable: false })
  projectId: number;

  @ManyToOne(() => Projects, (project) => project.crs, {
    nullable: false,
  })
  @JoinColumn({ name: "projectId" })
  project: Projects;

  @Column({ nullable: false, type: "boolean", default: false })
  isInternalCr: boolean;

  @Column({ type: "enum", enum: Object.values(BillingType), nullable: false })
  billingType: BillingType;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  hourlyMonthlyRate: string;

  @Column({ type: "int", default: 0, nullable: false })
  crHours: number;

  @Column({ type: "enum", enum: Object.values(CurrencyType), nullable: false })
  currency: CurrencyType;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  crCost: string;

  @Column({ type: "int", nullable: false })
  paymentTermDays: number;

  @Column({
    type: "enum",
    enum: Object.values(InvoicePaymentCycle),
    nullable: true,
  })
  invoicePaymentCycle: InvoicePaymentCycle;

  @Column({ nullable: true })
  invoiceDay: string;

  @Column({ nullable: true })
  invoiceDate: Date;

  @OneToMany(() => Invoices, (invoice) => invoice.crs, { nullable: true })
  invoices: Invoices[];

  @Column({ nullable: false, default: false, type: "boolean" })
  isInvoiced: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
