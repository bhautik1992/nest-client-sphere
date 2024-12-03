import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRole } from "src/common/constants/enum.constant";
export class CreateUserDto {
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
  @IsEnum(UserRole)
  role: UserRole;

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
  @IsString()
  designation: string;

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
  @IsString()
  reportingPerson: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}
