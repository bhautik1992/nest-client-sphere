import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import {
  EmployeeRole,
  EmployeeStatus,
} from "src/common/constants/enum.constant";
export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  middleName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  personalEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  joiningDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  reportingPersonId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PAN: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aadhar: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  IFSC: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emergencyContactName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emergencyContactNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}
