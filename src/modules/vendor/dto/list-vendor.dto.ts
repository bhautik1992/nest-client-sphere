import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListVendorDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedVendor: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;
}
