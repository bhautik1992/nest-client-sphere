import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import {
  BillingType,
  CurrencyType,
  InvoiceStatus,
  ProjectStatus,
} from "src/common/constants/enum.constant";
export class CreateProjectDto {
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
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

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
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(InvoiceStatus)
  invoiceStatus: InvoiceStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectManager: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BillingType)
  billingType: BillingType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  hourlyMonthlyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
