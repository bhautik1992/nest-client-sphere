import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ListDto } from "src/common/dto/common.dto";

export class ListPaymentDto extends ListDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deletedPayment: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  paymentNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  paymentDate: string;
}
