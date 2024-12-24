import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MILESTONE_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { Repository } from "typeorm";
import { CreateMileStoneDto } from "./dto/create-milestone.dto";
import { UpdateMileStoneDto } from "./dto/update-milestone.dto";
import { MileStones } from "./entity/mileStone.entity";

@Injectable()
export class MileStoneService {
  constructor(
    @InjectRepository(MileStones)
    private readonly mileStoneRepository: Repository<MileStones>,
  ) {}

  async create(createMileStoneDto: CreateMileStoneDto) {
    try {
      const queryBuilder =
        this.mileStoneRepository.createQueryBuilder("mileStone");
      const result = queryBuilder
        .insert()
        .into(MileStones)
        .values(createMileStoneDto)
        .execute();
      return result;
    } catch (error) {
      throw CustomError(error.message, error.status);
    }
  }

  async update(id: number, updateMileStoneDto: UpdateMileStoneDto) {
    try {
      const milestone = await this.mileStoneRepository.findOneBy({ id });
      if (!milestone) {
        throw CustomError(
          MILESTONE_RESPONSE_MESSAGES.MILESTONE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedData: any = { ...milestone, ...updateMileStoneDto };
      return await this.mileStoneRepository.save(updatedData);
    } catch (error) {
      throw CustomError(error.message, error.status);
    }
  }

  async delete(id: number) {
    try {
      const isMileStoneExist = await this.mileStoneRepository.findOneBy({
        id,
      });
      if (isMileStoneExist) {
        await this.mileStoneRepository.delete({ id });
      }
      return;
    } catch (error) {
      throw CustomError(error.message, error.status);
    }
  }

  async getMileStonesByProjectId(projectId: number) {
    try {
      const mileStones = await this.mileStoneRepository.find({
        where: { projectId },
      });
      return mileStones;
    } catch (error) {
      throw CustomError(error.message, error.status);
    }
  }
}
