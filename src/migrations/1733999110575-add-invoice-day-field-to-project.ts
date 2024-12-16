import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddInvoiceDayFieldToProject1733999110575
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLE_NAMES.PROJECT,
      new TableColumn({
        name: "invoiceDay",
        type: "varchar",
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      TABLE_NAMES.PROJECT,
      new TableColumn({
        name: "invoiceDate",
        type: "date",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLE_NAMES.PROJECT, "invoiceDay");
    await queryRunner.dropColumn(TABLE_NAMES.PROJECT, "invoiceDate");
  }
}
