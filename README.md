# Boilerplate Typeorm

## Getting started

Boilerplate Typeorm Nest JS app is a boilerplate integrating Typeorm Postgres, featuring complete user authentication and full CRUD operations for user management.

## Prerequisites

Before you begin, make sure you have the following requirements met:

- [Node.js](https://nodejs.org/) (version 20.11.1)

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   $ git clone -b typeorm-migration http://192.168.4.9/root/boilerplate-nestjs.git
   ```

2. **Install dependencies:**

   ```bash
   $ npm install
   ```

3. **Reference env.example file and add .env file:**


## Generating a New Migration

To generate a new migration that create table, follow these steps:

### Generate the migration file:

```bash
npm run typeorm migration:create -- -n CreateYourTableName
```
Open Migration file and update
```
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateYourTableName1616781234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'your_table_name',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '25',
          },
          {
            name: 'status',
            type: 'boolean',
          },
          {
            name: 'create_date',
            type: 'date',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('your_table_name');
  }
}

```
### Generate the migration file:
To generate a new migration that adds columns to an existing table, follow these steps:

```bash
npm run typeorm migration:create -- -n AddColumnsToYourTable
```

Edit the generated migration file:
Navigate to the src/migrations directory and open the newly created migration file. Modify it to add the desired columns:

```
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsToYourTable1616781234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('your_table_name', new TableColumn({
      name: 'name',
      type: 'text',
    }));

    await queryRunner.addColumn('your_table_name', new TableColumn({
      name: 'email',
      type: 'varchar',
      length: '25',
    }));

    await queryRunner.addColumn('your_table_name', new TableColumn({
      name: 'status',
      type: 'boolean',
    }));

    await queryRunner.addColumn('your_table_name', new TableColumn({
      name: 'create_date',
      type: 'date',
      default: 'CURRENT_TIMESTAMP',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('your_table_name', 'name');
    await queryRunner.dropColumn('your_table_name', 'email');
    await queryRunner.dropColumn('your_table_name', 'status');
    await queryRunner.dropColumn('your_table_name', 'create_date');
  }
}

```

## Running the Migration
 After editing the migration file, follow these steps to run the migration:

## Compile your TypeScript files:

```bash
npm run build
```

## Run the migration:
```bash
npm run typeorm migration:run
```
## Running the app

## Run `npm run start` for a dev server. Navigate to `http://localhost:3000/`.

## Release Note

     node version (20.11.1)
     typeorm version (0.3.20)
     last updated date : 11-06-2024
