import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsIn,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateContribuicaoDto {
  @IsString()
  cooperado_id: string;

  @IsNumber({}, { message: 'Valor deve ser um número decimal válido' })
  valor: number;

  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;

  @IsInt()
  @Min(2020)
  @Max(2100)
  ano: number;

  @IsOptional()
  @IsString()
  @IsIn(['parcela', 'quitacao'], { message: 'Tipo deve ser "parcela" ou "quitacao"' })
  tipo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
