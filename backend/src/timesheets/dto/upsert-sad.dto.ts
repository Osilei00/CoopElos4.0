import { IsString, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class UpsertSadDto {
  @IsString()
  cooperado_id: string;

  @IsString()
  patient_id: string;

  @IsInt()
  @Min(2000)
  year: number;

  @IsInt()
  @Min(1)
  month: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  morning_shifts?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  night_shifts?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  six_by_one?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gross_value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  meal_allowance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quota_value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  net_value?: number;
}
