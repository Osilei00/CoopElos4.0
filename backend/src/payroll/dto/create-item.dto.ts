import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePayrollItemDto {
  @IsString()
  cooperado_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gross_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discounts?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  net_amount?: number;
}
