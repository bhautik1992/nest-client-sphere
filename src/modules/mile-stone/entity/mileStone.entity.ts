import { TABLE_NAMES } from "src/common/constants/table-name.constant";
import { Projects } from "src/modules/project/entity/project.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: TABLE_NAMES.PROJECT_MILESTONES })
export class MileStones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  details: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  PISHours: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  PMSHours: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  cost: string;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => Projects, (project) => project.milestones, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "projectId" })
  projectId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
