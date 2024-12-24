import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";
import {
  BillingType,
  CrStatus,
  CurrencyType,
  InvoicePaymentCycle,
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
    enum: Object.values(CrStatus),
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
    name: "projectId",
    type: "int",
    isNullable: false,
  },
  {
    name: "isInternalCr",
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
    name: "crHours",
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
    name: "crCost",
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

export class CrEntity1732195177614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.CR,
        columns: columnsObjects,
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.CR,
      new TableForeignKey({
        columnNames: ["clientId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.CLIENT,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE_NAMES.CR);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("clientId") !== -1,
    );
    await queryRunner.dropForeignKey(TABLE_NAMES.CR, foreignKey);
    await queryRunner.dropTable(TABLE_NAMES.CR);
  }
}
