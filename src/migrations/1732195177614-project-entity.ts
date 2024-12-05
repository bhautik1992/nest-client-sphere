import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";
import {
  BillingType,
  CurrencyType,
  InvoicePaymentCycle,
  ProjectStatus,
} from "../common/constants/enum.constant";
import { TABLE_NAMES } from "../common/constants/table-name.constant";

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
    enum: Object.values(ProjectStatus),
    default: "'not_started'",
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
    name: "assignFromCompanyId",
    type: "int",
    isNullable: false,
  },
  {
    name: "clientId",
    type: "int",
    isNullable: false,
  },
  {
    name: "assignToCompanyId",
    type: "int",
    isNullable: false,
  },
  {
    name: "projectManager",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "teamLeader",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "isInternalProject",
    type: "boolean",
    default: false,
    isNullable: false,
  },
  {
    name: "billingType",
    type: "enum",
    enum: Object.values(BillingType),
    default: "'hourly'",
    isNullable: false,
  },
  {
    name: "hourlyMonthlyRate",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  },
  {
    name: "projectHours",
    type: "int",
    default: 0,
  },
  {
    name: "currency",
    type: "enum",
    enum: Object.values(CurrencyType),
    default: "'USD'",
    isNullable: false,
  },
  {
    name: "projectCost",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: false,
  },
  {
    name: "paymentTermDays",
    type: "int",
    isNullable: false,
  },
  {
    name: "invoicePaymentCycle",
    type: "enum",
    enum: Object.values(InvoicePaymentCycle),
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE_NAMES.PROJECT);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("clientId") !== -1,
    );
    await queryRunner.dropForeignKey(TABLE_NAMES.PROJECT, foreignKey);
    await queryRunner.dropTable(TABLE_NAMES.PROJECT);
  }
}
