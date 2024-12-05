import { Designation, EmployeeRole } from "src/common/constants/enum.constant";
import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: TABLE_NAMES.EMPLOYEE })
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ type: "enum", enum: Object.values(EmployeeRole), nullable: false })
  role: EmployeeRole;

  @Column({ nullable: false, unique: true })
  personalEmail: string;

  @Column({ nullable: false, unique: true })
  companyEmail: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  department: string;

  @Column({ type: "enum", enum: Object.values(Designation), nullable: false })
  designation: Designation;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: false })
  joiningDate: Date;

  @Column({ type: "int", nullable: false })
  reportingPersonId: number;

  @ManyToOne(() => Employee, (employee) => employee.reportees, {
    nullable: true,
  })
  @JoinColumn({ name: "reportingPersonId" })
  reportingPerson: Employee;

  @OneToMany(() => Employee, (employee) => employee.reportingPerson)
  reportees: Employee[];

  @Column({ nullable: false, unique: true })
  employeeCode: string;

  @BeforeInsert()
  async generateEmployeeCode() {
    const lastEmployee = await Employee.find({
      order: { id: "DESC" },
      take: 1,
    });
    const lastId = lastEmployee.length > 0 ? lastEmployee[0].id : 0;
    const nextId = lastId + 1;
    this.employeeCode = `EMP${String(nextId).padStart(2, "0")}`;
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
