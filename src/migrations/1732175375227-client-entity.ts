import { ClientStatus, Designation } from "../common/constants/enum.constant";
import { TABLE_NAMES } from "../common/constants/table-name.constant";
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

const columns = [
  {
    name: "id",
    type: "int",
    isPrimary: true,
    isGenerated: true,
    generationStrategy: "increment",
  },
  {
    name: "firstName",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "lastName",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "email",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "phone",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "designation",
    type: "enum",
    enum: Object.values(Designation),
    isNullable: false,
  },
  {
    name: "companyId",
    type: "int",
    isNullable: false,
  },
  {
    name: "clientCompanyName",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "accountManager",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "website",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "address",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "gender",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "countryCode",
    type: "varchar",
    isNullable: false,
  },
  {
    name: "stateCode",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "cityName",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "zipCode",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "skypeId",
    type: "varchar",
    isNullable: true,
  },
  {
    name: "status",
    type: "enum",
    enum: Object.values(ClientStatus),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationStrategy: generationStrategy as any, // Cast to any to bypass the type check
    });
  }
  return new TableColumn(rest);
});

export class ClientEntity1732175375227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.CLIENT,
        columns: columnsObjects,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.CLIENT);
  }
}
