import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ProjectStatus } from "src/common/constants/enum.constant";
export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;
}
