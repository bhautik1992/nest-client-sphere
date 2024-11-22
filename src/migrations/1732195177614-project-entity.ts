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
    name: "description",
    type: "text",
    isNullable: true,
  },
  {
    name: "status",
    type: "enum",
    enum: ["not_started", "start", "in_progress", "completed"],
    default: "'not_started'",
    isNullable: false,
  },
  {
    name: "amount",
    type: "numeric",
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
  {
    name: "clientId",
    type: "int",
    isNullable: false,
  },
  {
    name: "companyId",
    type: "int",
    isNullable: false,
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

export class ProjectEntity1732195177614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.PROJECT,
        columns: columnsObjects,
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.PROJECT,
      new TableForeignKey({
        columnNames: ["clientId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.CLIENT,
        onDelete: "CASCADE",
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.PROJECT,
      new TableForeignKey({
        columnNames: ["companyId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.COMPANY,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE_NAMES.PROJECT);
    const companyTable = await queryRunner.getTable(TABLE_NAMES.COMPANY);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("clientId") !== -1,
    );
    const companyForeignKey = companyTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("companyId") !== -1,
    );
    await queryRunner.dropForeignKey(TABLE_NAMES.PROJECT, foreignKey);
    await queryRunner.dropForeignKey(TABLE_NAMES.PROJECT, companyForeignKey);
    await queryRunner.dropTable(TABLE_NAMES.PROJECT);
  }
}
