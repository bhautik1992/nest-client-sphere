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
import { CreateMileStoneDto } from "src/modules/mile-stone/dto/create-milestone.dto";
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
  @IsNumber()
  projectManagerId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  teamLeaderId: number;

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
  @IsString()
  hourlyMonthlyRate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectCost: string;

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

  @ApiProperty()
  @IsOptional()
  @IsString()
  invoiceDay: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  invoiceDate: string;

  @ApiProperty({ type: [CreateMileStoneDto] })
  @IsOptional()
  milestones: CreateMileStoneDto[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  createdBy: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  updatedBy: number;
}
