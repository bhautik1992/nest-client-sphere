import { UserRole } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
} from "typeorm";

@Entity({ name: TABLE_NAMES.USER })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ type: "enum", enum: Object.values(UserRole), nullable: false })
  role: UserRole;

  @Column({ nullable: false, unique: true })
  personalEmail: string;

  @Column({ nullable: false, unique: true })
  companyEmail: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  designation: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: false })
  joiningDate: Date;

  @Column({ nullable: false })
  reportingPerson: string;

  @Column({ nullable: false, unique: true })
  userCode: string;

  @BeforeInsert()
  async generateUserCode() {
    const lastUser = await Users.find({
      order: { id: "DESC" },
      take: 1,
    });
    const lastId = lastUser.length > 0 ? lastUser[0].id : 0;
    const nextId = lastId + 1;
    this.userCode = `USER${String(nextId).padStart(2, "0")}`;
  }

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
