import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
export class CreateMileStoneDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PISHours: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PMSHours: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cost: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  projectId: number;
}
