import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { UserRole } from "../common/constants/enum.constant";

const columns = [
  {
    name: "id",
    type: "int",
    isPrimary: true,
    isGenerated: true,
    generationStrategy: "increment",
  },
  {
    name: "first_name",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "last_name",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "email",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "password",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "role",
    type: "enum",
    enum: [UserRole.ADMIN, UserRole.USER],
    isNullable: false,
  },
];

const columnsObjects = columns.map((column) => {
  const { generationStrategy, ...rest } = column;
  if (generationStrategy) {
    return new TableColumn({
      ...rest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationStrategy: generationStrategy as any, // Cast to any to bypass the type check
    });
  }
  return new TableColumn(rest);
});

export class UserEntity1717681709976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.USER,
        columns: columnsObjects,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.USER);
  }
}
