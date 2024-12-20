import { PaymentMethod } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Companies } from "src/modules/company/entity/company.entity";
import { Invoices } from "src/modules/invoice/entity/invoice.entity";
import { Projects } from "src/modules/project/entity/project.entity";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.PAYMENT })
export class Payments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  paymentNumber: string;

  @BeforeInsert()
  async generateInvoiceNumber() {
    const prefix = "INFIAZURE";
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const today = `${year}${month}${day}`;
    const lastInvoice = await Payments.find({
      order: { paymentNumber: "DESC" },
      take: 1,
    });
    const lastId = lastInvoice.length > 0 ? lastInvoice[0].id : 0;
    const increment = lastId + 1;
    this.paymentNumber = `${prefix}-${today}-${increment.toString().padStart(2, "0")}`;
  }

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  uniquePaymentId: string;

  @Column({ type: "int", nullable: false })
  companyId: number;

  @ManyToOne(() => Companies, (company) => company.Invoices, {
    nullable: false,
  })
  @JoinColumn({ name: "companyId" })
  company: Companies;

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
}
