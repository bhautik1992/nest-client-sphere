import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class ListCitiesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  stateCode: string;
}
