import { Module } from "@nestjs/common";
import { MileStoneController } from "./mile-stone.controller";
import { MileStoneService } from "./mile-stone.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MileStones } from "./entity/mileStone.entity";
import { Projects } from "../project/entity/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MileStones, Projects])],
  controllers: [MileStoneController],
  providers: [MileStoneService],
  exports: [MileStoneService],
})
export class MileStoneModule {}
