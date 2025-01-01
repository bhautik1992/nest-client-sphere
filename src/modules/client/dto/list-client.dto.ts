import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListClientDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedClient: boolean;

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
  @IsNumber()
  accountManagerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
}
