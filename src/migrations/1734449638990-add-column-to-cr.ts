import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnIsInvoicedToCr1734449638990
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLE_NAMES.CR,
      new TableColumn({
        name: "isInvoiced",
        type: "boolean",
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLE_NAMES.CR, "isInvoiced");
  }
}
