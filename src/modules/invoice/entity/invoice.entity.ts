import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Clients } from "src/modules/client/entity/client.entity";
import { Companies } from "src/modules/company/entity/company.entity";
import { Crs } from "src/modules/cr/entity/cr.entity";
import { Payments } from "src/modules/payment/entity/payment.entity";
import { Projects } from "src/modules/project/entity/project.entity";
import {
  BaseEntity,
  BeforeInsert,
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
export class Invoices extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  invoiceNumber: string;

  @BeforeInsert()
  async generateInvoiceNumber() {
    const prefix = "INFIAZURE";
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const today = `${year}${month}${day}`;
    const lastInvoice = await Invoices.find({
      order: { invoiceNumber: "DESC" },
      take: 1,
    });
    const lastId = lastInvoice.length > 0 ? lastInvoice[0].id : 0;
    const increment = lastId + 1;
    this.invoiceNumber = `${prefix}-${today}-${increment.toString().padStart(2, "0")}`;
  }

  @Column({ nullable: true, type: "varchar", length: 255 })
  customInvoiceNumber: string;

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
  invoiceDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: "int", default: 0, nullable: true })
  amount: number;

  @Column({ type: "int", default: 0, nullable: true })
  additionalAmount: number;

  @Column({ type: "varchar", nullable: true })
  additionalChargeDesc: string;

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

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
