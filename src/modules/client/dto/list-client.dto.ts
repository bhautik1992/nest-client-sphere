import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListClientDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedClient: boolean;
}
