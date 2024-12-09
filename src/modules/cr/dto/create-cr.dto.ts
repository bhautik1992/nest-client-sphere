import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import {
  BillingType,
  CrStatus,
  CurrencyType,
  InvoicePaymentCycle,
} from "src/common/constants/enum.constant";
export class CreateCrDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CrStatus)
  status: CrStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  assignFromCompanyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isInternalCr: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BillingType)
  billingType: BillingType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hourlyMonthlyRate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  crHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  crCost: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paymentTermDays: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(InvoicePaymentCycle)
  invoicePaymentCycle: InvoicePaymentCycle;
}
