import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { PaymentMethod } from "src/common/constants/enum.constant";

class InvoiceAmountDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  invoicedCost: string;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  uniquePaymentId: string;

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
  paymentDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  receivedINR: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  conversionRate: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  paymentAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  invoiceIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  invoiceAmount: InvoiceAmountDto[];
}
