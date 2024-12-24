import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
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
}
