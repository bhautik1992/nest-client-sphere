import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDesignationChangeRole1733813826504
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.EMPLOYEE} DROP COLUMN designation`,
    );
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.CLIENT} DROP COLUMN designation`,
    );
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.VENDOR} DROP COLUMN designation`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.EMPLOYEE} ADD COLUMN designation`,
    );
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.CLIENT} ADD COLUMN designation`,
    );
    await queryRunner.query(
      `ALTER TABLE ${TABLE_NAMES.VENDOR} ADD COLUMN designation`,
    );
  }
}
