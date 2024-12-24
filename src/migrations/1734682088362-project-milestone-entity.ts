import { TABLE_NAMES } from "../common/constants/table-name.constant";
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

const columns = [
  {
    name: "id",
    type: "int",
    isPrimary: true,
    isGenerated: true,
    generationStrategy: "increment",
  },
  {
    name: "name",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "details",
    type: "text",
    isNullable: false,
  },
  {
    name: "PISHours",
    type: "int",
    default: 0,
    isNullable: false,
  },
  {
    name: "PMSHours",
    type: "int",
    default: 0,
    isNullable: false,
  },
  {
    name: "cost",
    type: "int",
    default: 0,
    isNullable: false,
  },
  {
    name: "startDate",
    type: "date",
    isNullable: false,
  },
  {
    name: "endDate",
    type: "date",
    isNullable: true,
  },
  {
    name: "projectId",
    type: "int",
    isNullable: false,
  },
  {
    name: "deletedAt",
    type: "timestamp",
    isNullable: true,
  },
  {
    name: "createdAt",
    type: "timestamp",
    default: "CURRENT_TIMESTAMP",
  },
  {
    name: "updatedAt",
    type: "timestamp",
    default: "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  },
];

const columnsObjects = columns.map((column) => {
  const { generationStrategy, ...rest } = column;
  if (generationStrategy) {
    return new TableColumn({
      ...rest,
      generationStrategy: generationStrategy as any, // Cast to any to bypass the type check
    });
  }
  return new TableColumn(rest);
});

export class ProjectMilestone1734682088362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.PROJECT_MILESTONES,
        columns: columnsObjects,
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.PROJECT_MILESTONES,
      new TableForeignKey({
        columnNames: ["projectId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.PROJECT,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE_NAMES.PROJECT_MILESTONES);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("projectId") !== -1,
    );
    await queryRunner.dropForeignKey(
      TABLE_NAMES.PROJECT_MILESTONES,
      foreignKey,
    );

    await queryRunner.dropTable(TABLE_NAMES.PROJECT_MILESTONES);
  }
}
