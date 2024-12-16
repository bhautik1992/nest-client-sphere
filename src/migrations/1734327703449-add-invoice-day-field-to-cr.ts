import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddInvoiceDayFieldToCr1734327703449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLE_NAMES.CR,
      new TableColumn({
        name: "invoiceDay",
        type: "varchar",
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      TABLE_NAMES.CR,
      new TableColumn({
        name: "invoiceDate",
        type: "date",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLE_NAMES.CR, "invoiceDay");
    await queryRunner.dropColumn(TABLE_NAMES.CR, "invoiceDate");
  }
}
