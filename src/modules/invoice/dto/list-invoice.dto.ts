import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListInvoiceDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedInvoice: boolean;

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
  invoiceNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  invoiceDate: string;
}
