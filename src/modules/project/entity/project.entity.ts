import {
  BillingType,
  CurrencyType,
  InvoicePaymentCycle,
  ProjectStatus,
} from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Vendors } from "src/modules/vendor/entity/vendor.entity";
import { Crs } from "src/modules/cr/entity/cr.entity";
import { Employee } from "src/modules/employee/entity/employee.entity";
import { Invoices } from "src/modules/invoice/entity/invoice.entity";
import { MileStones } from "src/modules/mile-stone/entity/mileStone.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.PROJECT })
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "enum", enum: Object.values(ProjectStatus), nullable: false })
  status: ProjectStatus;

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
  assignToCompanyId: number;

  @ManyToOne(() => Vendors, (company) => company.assignedToProjects, {
    nullable: false,
  })
  @JoinColumn({ name: "assignToCompanyId" })
  assignToCompany: Vendors;

  @Column({ type: "int", nullable: false })
  projectManagerId: number;

  @ManyToOne(() => Employee, (emp) => emp.projectManager, {
    nullable: false,
  })
  @JoinColumn({ name: "projectManagerId" })
  projectManager: Employee;

  @Column({ type: "int", nullable: true })
  teamLeaderId: number;

  @ManyToOne(() => Employee, (emp) => emp.teamLeader, { nullable: true })
  @JoinColumn({ name: "teamLeaderId" })
  teamLeader: Employee;

  @Column({ nullable: false, type: "boolean", default: false })
  isInternalProject: boolean;

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
  projectHours: number;

  @Column({ type: "enum", enum: Object.values(CurrencyType), nullable: false })
  currency: CurrencyType;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  projectCost: string;

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

  @OneToMany(() => Crs, (cr) => cr.project)
  crs: Crs[];

  @OneToMany(() => Invoices, (invoice) => invoice.project)
  invoices: Invoices[];

  @OneToMany(() => MileStones, (milestone) => milestone.projectId)
  milestones: MileStones[];

  @Column({ type: "int", nullable: false })
  createdBy: number;

  @OneToOne(() => Employee, (emp) => emp.projectCreated, {
    nullable: false,
  })
  @JoinColumn({ name: "createdBy" })
  createdByEmployee: Employee;

  @Column({ type: "int", nullable: false })
  updatedBy: number;

  @OneToOne(() => Employee, (emp) => emp.projectUpdated, {
    nullable: false,
  })
  @JoinColumn({ name: "updatedBy" })
  updatedByEmployee: Employee;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
