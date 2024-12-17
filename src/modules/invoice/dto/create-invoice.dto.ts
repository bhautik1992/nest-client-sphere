import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

class CrInvoiceAmountDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  crCost: string;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  invoiceDate: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dueDate: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  crIds: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalChargeDesc: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isUpdateCrAmount: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  crInvoiceAmount: CrInvoiceAmountDto[];
}
