import { ClientStatus } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
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
import { Employee } from "src/modules/employee/entity/employee.entity";

@Entity({ name: TABLE_NAMES.CLIENT })
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: "int", nullable: false })
  companyId: number;

  @ManyToOne(() => Vendors, (company) => company.clients, { nullable: false })
  @JoinColumn({ name: "companyId" })
  company: Vendors;

  @Column({ nullable: true })
  clientCompanyName: string;

  @Column({ nullable: false })
  accountManagerId: number;

  @ManyToOne(() => Employee, (emp) => emp.clients, { nullable: false })
  @JoinColumn({ name: "accountManagerId" })
  accountManager: Employee;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  gender: string;

  @Column({ nullable: false })
  countryCode: string;

  @Column({ nullable: true })
  stateCode: string;

  @Column({ nullable: true })
  cityName: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ type: "enum", enum: Object.values(ClientStatus) })
  status: ClientStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Projects, (project) => project.client)
  projects: Projects[];

  @OneToMany(() => Invoices, (invoice) => invoice.client)
  invoices: Invoices[];
}
