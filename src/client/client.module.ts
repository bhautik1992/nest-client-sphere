import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Clients } from "./entity/client.entity";
import { Projects } from "src/project/entity/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Clients, Projects])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
