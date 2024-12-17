import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Employee } from "src/modules/employee/entity/employee.entity";
import { Clients } from "src/modules/client/entity/client.entity";
import { Companies } from "src/modules/company/entity/company.entity";
import { Projects } from "src/modules/project/entity/project.entity";
import { Vendor } from "src/modules/vendor/entity/vendor.entity";
import { Crs } from "src/modules/cr/entity/cr.entity";
import { Invoices } from "src/modules/invoice/entity/invoice.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options: TypeOrmModuleOptions = {
          type: "postgres",
          ssl: JSON.parse(configService.get("database.postgres.enableSSL")),
          host: configService.get<string>("database.host"),
          port: configService.get<number>("database.port"),
          username: configService.get<string>("database.user"),
          password: configService.get<string>("database.password"),
          database: configService.get<string>("database.name"),
          entities: [
            Employee,
            Clients,
            Companies,
            Projects,
            Vendor,
            Crs,
            Invoices,
          ],
          synchronize: false,
          logging: false,
        };
        return options;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
