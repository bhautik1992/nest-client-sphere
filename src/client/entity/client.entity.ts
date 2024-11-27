import { ClientStatus } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Projects } from "src/project/entity/project.entity";
import { Country } from "src/country/entity/country.entity";

@Entity({ name: TABLE_NAMES.CLIENT })
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  gender: string;

  @ManyToOne(() => Country, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "countryId" })
  country: Country;

  @Column({ type: "int", nullable: false })
  countryId: number;

  @Column({ type: "enum", enum: ClientStatus })
  status: string;

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
