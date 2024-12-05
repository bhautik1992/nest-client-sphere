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
  CurrencyType,
  InvoicePaymentCycle,
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
  assignFromCompanyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  assignToCompanyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectManager: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teamLeader: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isInternalProject: boolean;

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
  projectCost: number;

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
