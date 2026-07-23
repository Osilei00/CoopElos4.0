import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;
}
