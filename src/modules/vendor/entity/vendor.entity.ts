import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Companies } from "src/modules/company/entity/company.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.VENDOR })
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: "int", nullable: false })
  companyId: number;

  @ManyToOne(() => Companies, (company) => company.clients, { nullable: false })
  @JoinColumn({ name: "companyId" })
  company: Companies;

  @Column({ nullable: false })
  vendorCompanyName: string;

  @Column({ nullable: false })
  accountManager: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  skypeId: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  countryCode: string;

  @Column({ nullable: true })
  stateCode: string;

  @Column({ nullable: true })
  cityName: string;

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
}
