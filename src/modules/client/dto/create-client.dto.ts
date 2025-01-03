import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ClientStatus } from "src/common/constants/enum.constant";
export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickName: string;

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
  @IsOptional()
  @IsString()
  clientCompanyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountManagerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

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
  @IsNotEmpty()
  @IsEnum(ClientStatus)
  status: ClientStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;
}
