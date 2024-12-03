import { ClientStatus } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Projects } from "src/modules/project/entity/project.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: TABLE_NAMES.CLIENT })
export class Clients {
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

  @Column({ nullable: false })
  designation: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  clientCompanyName: string;

  @Column({ nullable: false })
  accountManager: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  gender: string;

  @Column({ nullable: false })
  countryCode: string;

  @Column({ nullable: false })
  stateCode: string;

  @Column({ nullable: false })
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

  @OneToMany(() => Projects, (project) => project.client)
  projects: Projects[];
}
