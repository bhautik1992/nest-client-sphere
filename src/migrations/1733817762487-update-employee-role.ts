import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeRoleEnum1733817762487 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE employee_role_new AS ENUM(
          'admin',
          'sales_manager',
          'sales_executive',
          'project_manager',
          'team_leader',
          'senior_software_engineer',
          'software_engineer',
          'trainee'
        )
      `);

    await queryRunner.query(`
        ALTER TABLE ${TABLE_NAMES.EMPLOYEE}
        ALTER COLUMN role TYPE TEXT
      `);

    await queryRunner.query(`
        UPDATE ${TABLE_NAMES.EMPLOYEE}
        SET role = 'software_engineer'
        WHERE role = 'employee'
      `);

    await queryRunner.query(`
        ALTER TABLE ${TABLE_NAMES.EMPLOYEE}
        ALTER COLUMN role TYPE employee_role_new
        USING role::text::employee_role_new
      `);

    await queryRunner.query(`DROP TYPE public.table_employee_role_enum`);

    await queryRunner.query(
      `ALTER TYPE employee_role_new RENAME TO table_employee_role_enum`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE public.table_employee_role_enum AS ENUM(
          'admin',
          'employee'
        )
      `);

    await queryRunner.query(`
        ALTER TABLE ${TABLE_NAMES.EMPLOYEE}
        ALTER COLUMN role TYPE public.table_employee_role_enum
        USING role::text::public.table_employee_role_enum
      `);

    await queryRunner.query(`DROP TYPE table_employee_role_enum`);
  }
}
