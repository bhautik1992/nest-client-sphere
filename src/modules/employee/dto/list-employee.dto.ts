import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListEmployeeDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedEmployee: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  employeeCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role: string;
}
