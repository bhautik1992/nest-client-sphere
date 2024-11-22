import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  IsDateString,
  IsString,
  IsEmpty,
} from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  new_password: string;
}

export class DateRangeDto {
  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.endDate)
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.startDate)
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}

export class IdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class ListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsEmpty()
  @IsString()
  search: string;
}
