import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListProjectDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isInternalProject: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedProject: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  projectManagerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate: string;
}
