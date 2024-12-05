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
import { Designation, EmployeeRole } from "src/common/constants/enum.constant";
export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

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
  @IsNotEmpty()
  @IsEnum(Designation)
  designation: Designation;

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
  @IsOptional()
  @IsString()
  password: string;
}
