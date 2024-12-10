import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
export class CreateVendorDto {
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
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendorCompanyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountManager: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  stateCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cityName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  skypeId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  website: string;
}
