import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FileUploadDto {
  @IsString()
  @ApiProperty({ required: true })
  moduleName: string;

  @ApiProperty({ format: "binary", type: "string", required: true })
  file: string;
}
