import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ImageUrlFieldToEmployee1735818886681
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLE_NAMES.EMPLOYEE,
      new TableColumn({
        name: "imageUrl",
        type: "varchar",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLE_NAMES.EMPLOYEE, "imageUrl");
  }
}
