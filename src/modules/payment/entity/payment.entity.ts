import { PaymentMethod } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Invoices } from "src/modules/invoice/entity/invoice.entity";
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
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.PAYMENT })
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  paymentNumber: string;

  @Column({ type: "int", nullable: false })
  companyId: number;

  @ManyToOne(() => Vendors, (company) => company.Invoices, {
    nullable: false,
  })
  @JoinColumn({ name: "companyId" })
  company: Vendors;

  @Column({ type: "int", nullable: false })
  projectId: number;

  @ManyToOne(() => Projects, (project) => project.invoices, {
    nullable: false,
  })
  @JoinColumn({ name: "projectId" })
  project: Projects;

  @Column({ nullable: false })
  paymentDate: Date;

  @Column({ type: "enum", enum: Object.values(PaymentMethod), nullable: false })
  paymentMethod: PaymentMethod;

  @Column({ type: "int", default: 0, nullable: false })
  receivedINR: number;

  @Column({ type: "int", default: 1, nullable: true })
  conversionRate: number;

  @Column({ type: "varchar", nullable: true })
  comment: string;

  @Column({ type: "int", nullable: false })
  paymentAmount: number;

  @ManyToMany(() => Invoices, (invoice) => invoice.payments, {
    nullable: true,
  })
  @JoinTable({
    name: TABLE_NAMES.PAYMENT_INVOICES,
    joinColumn: {
      name: "paymentId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "invoiceId",
      referencedColumnName: "id",
    },
  })
  invoices: Invoices[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
