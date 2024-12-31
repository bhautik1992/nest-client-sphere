import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Crs } from "src/modules/cr/entity/cr.entity";
import { Payments } from "src/modules/payment/entity/payment.entity";
import { Projects } from "src/modules/project/entity/project.entity";
import { Vendors } from "src/modules/vendor/entity/vendor.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.INVOICE })
export class Invoices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  invoiceNumber: string;

  @Column({ type: "int", nullable: false })
  companyId: number;

  @ManyToOne(() => Vendors, (company) => company.Invoices, {
    nullable: false,
  })
  @JoinColumn({ name: "companyId" })
  company: Vendors;

  @Column({ type: "int", nullable: false })
  clientId: number;

  @ManyToOne(() => Clients, (client) => client.invoices, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Clients;

  @Column({ type: "int", nullable: false })
  projectId: number;

  @ManyToOne(() => Projects, (project) => project.invoices, {
    nullable: false,
  })
  @JoinColumn({ name: "projectId" })
  project: Projects;

  @Column({ nullable: false })
  invoiceDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: "int", default: 0, nullable: true })
  amount: number;

  @Column({ type: "int", default: 0, nullable: true })
  additionalAmount: number;

  @Column({ type: "varchar", nullable: true })
  additionalChargeDesc: string;

  @Column({ type: "int", default: 0, nullable: true })
  additionalDiscountAmount: number;

  @Column({ type: "boolean", default: false, nullable: false })
  isPaymentReceived: boolean;

  @ManyToMany(() => Crs, (cr) => cr.invoices, {
    nullable: true,
  })
  @JoinTable({
    name: TABLE_NAMES.INVOICE_CRS,
    joinColumn: {
      name: "invoiceId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "crId",
      referencedColumnName: "id",
    },
  })
  crs: Crs[];

  @OneToMany(() => Payments, (payment) => payment.invoices, { nullable: false })
  payments: Payments[];

  @Column({ nullable: false, type: "int" })
  createdBy: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
