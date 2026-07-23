import { IsString, IsDateString, IsInt, Min } from 'class-validator';

export class CreateVacationDto {
  @IsString()
  cooperado_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsInt()
  @Min(1)
  days_count: number;

  @IsString()
  status?: string;
}
