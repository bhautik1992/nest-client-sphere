import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListCrDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isInternalCr: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedCr: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  projectId: number;

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
