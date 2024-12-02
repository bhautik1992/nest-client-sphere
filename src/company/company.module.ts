import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Companies } from "./entity/company.entity";
import { Projects } from "src/project/entity/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Projects])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
