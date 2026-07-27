import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdatePayrollItemDto {
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
