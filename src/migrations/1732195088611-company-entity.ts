import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
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
    name: "address",
    type: "text",
    isNullable: true,
  },
  {
    name: "email",
    type: "varchar",
    isNullable: false,
    unique: true,
  },
  {
    name: "countryCode",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "stateCode",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "cityCode",
    type: "varchar",
    isNullable: false,
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

export class CompanyEntity1732195088611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.COMPANY,
        columns: columnsObjects,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.COMPANY);
  }
}
