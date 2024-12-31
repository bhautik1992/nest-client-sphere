import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";
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
    name: "invoiceNumber",
    type: "varchar",
    length: "255",
    isNullable: false,
  },
  {
    name: "companyId",
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
    name: "invoiceDate",
    type: "date",
    isNullable: false,
  },
  {
    name: "dueDate",
    type: "date",
    isNullable: true,
  },
  {
    name: "amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: true,
  },
  {
    name: "additionalAmount",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: true,
  },
  {
    name: "additionalChargeDesc",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "additionalDiscountAmount",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: true,
  },
  {
    name: "isPaymentReceived",
    type: "boolean",
    default: false,
    isNullable: false,
  },
  {
    name: "paidAmount",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: false,
    default: 0,
  },
  {
    name: "markAsPaid",
    type: "boolean",
    default: false,
    isNullable: false,
  },
  {
    name: "createdBy",
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

export class InvoiceEntity1734340919917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.INVOICE,
        columns: columnsObjects,
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.INVOICE_CRS,
        columns: [
          {
            name: "invoiceId",
            type: "int",
          },
          {
            name: "crId",
            type: "int",
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.INVOICE,
      new TableForeignKey({
        columnNames: ["clientId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.CLIENT,
        onDelete: "CASCADE",
      }),
    );
    await queryRunner.createForeignKey(
      TABLE_NAMES.INVOICE_CRS,
      new TableForeignKey({
        columnNames: ["invoiceId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.INVOICE,
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      TABLE_NAMES.INVOICE_CRS,
      new TableForeignKey({
        columnNames: ["crId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.CR,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE_NAMES.INVOICE);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("clientId") !== -1,
    );
    await queryRunner.dropForeignKey(TABLE_NAMES.INVOICE, foreignKey);
    await queryRunner.dropTable(TABLE_NAMES.INVOICE);

    const invoiceCrsTable = await queryRunner.getTable(TABLE_NAMES.INVOICE_CRS);
    const foreignKeyInvoice = invoiceCrsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("invoiceId") !== -1,
    );
    const foreignKeyCr = invoiceCrsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("crId") !== -1,
    );

    await queryRunner.dropForeignKey(TABLE_NAMES.INVOICE, foreignKeyInvoice);
    await queryRunner.dropForeignKey(TABLE_NAMES.INVOICE, foreignKeyCr);
    await queryRunner.dropTable(TABLE_NAMES.INVOICE);
  }
}
