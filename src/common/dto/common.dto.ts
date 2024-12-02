import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
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
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
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
  offset: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ enum: ["asc", "desc"] })
  @IsOptional()
  @IsString()
  sortOrder: "asc" | "desc";

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy: string;
}
