import { IsString, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class UpsertHospitalDto {
  @IsString()
  cooperado_id: string;

  @IsInt()
  @Min(2000)
  year: number;

  @IsInt()
  @Min(1)
  month: number;

  schedule_data: any;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_hours?: number;
}
