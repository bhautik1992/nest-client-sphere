import { PaymentMethod } from "../common/constants/enum.constant";
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
    name: "paymentNumber",
    type: "varchar",
    length: "255",
    isNullable: false,
  },
  {
    name: "uniquePaymentId",
    type: "varchar",
    length: "255",
    isNullable: true,
    unique: true,
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
    name: "paymentDate",
    type: "date",
    isNullable: false,
  },
  {
    name: "paymentMethod",
    type: "enum",
    enum: Object.values(PaymentMethod),
    isNullable: false,
  },
  {
    name: "receivedINR",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: false,
  },
  {
    name: "conversionRate",
    type: "int",
    isNullable: true,
  },
  {
    name: "paymentAmount",
    type: "decimal",
    precision: 10,
    scale: 2,
    isNullable: false,
  },
  {
    name: "comment",
    type: "varchar",
    length: "255",
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

export class PaymentEntity1734498903380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.PAYMENT,
        columns: columnsObjects,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.PAYMENT_INVOICES,
        columns: [
          {
            name: "paymentId",
            type: "int",
          },
          {
            name: "invoiceId",
            type: "int",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TABLE_NAMES.PAYMENT_INVOICES,
      new TableForeignKey({
        columnNames: ["paymentId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.PAYMENT,
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      TABLE_NAMES.PAYMENT_INVOICES,
      new TableForeignKey({
        columnNames: ["invoiceId"],
        referencedColumnNames: ["id"],
        referencedTableName: TABLE_NAMES.INVOICE,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const paymentInvoicesTable = await queryRunner.getTable(
      TABLE_NAMES.PAYMENT_INVOICES,
    );
    const foreignKeyPayment = paymentInvoicesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("paymentId") !== -1,
    );
    const foreignKeyInvoice = paymentInvoicesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("crId") !== -1,
    );
    await queryRunner.dropForeignKey(TABLE_NAMES.PAYMENT, foreignKeyPayment);
    await queryRunner.dropForeignKey(TABLE_NAMES.INVOICE, foreignKeyInvoice);
    await queryRunner.dropTable(TABLE_NAMES.PAYMENT);
  }
}
