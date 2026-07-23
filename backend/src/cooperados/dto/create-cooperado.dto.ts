import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCooperadoDto {
  // Control
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  venc_cooperados?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  imagem_cooperado?: string;

  @IsOptional()
  @IsString()
  documentos?: string;

  // Personal data
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_cooperado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(14)
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' })
  cpf_cooperado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rg?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  nis_pis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ctps_serie?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  naturalidade?: string;

  @IsOptional()
  @IsDateString()
  nascimento?: string;

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  estado_civil?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  escolaridade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_pai?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_mae?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_conjuge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(14)
  cpf_conjuge?: string;

  // Contact data
  @IsOptional()
  @IsString()
  @MaxLength(20)
  celular_cooperado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone_residencial?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email_cooperado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  celular_indicador?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email_indicador?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_indicacao?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email_gestor?: string;

  // Address
  @IsOptional()
  @IsString()
  @MaxLength(500)
  endereco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bairro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  complemento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  estado?: string;

  // Professional data
  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa_trabalho?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cargo_pretendido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cargo_contratado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  salario?: string;

  @IsOptional()
  @IsDateString()
  data_admissao?: string;

  @IsOptional()
  @IsDateString()
  data_cadastro?: string;

  // Activities
  @IsOptional()
  @IsString()
  ativ_coop_dropa?: string;

  @IsOptional()
  @IsString()
  ativ_coop_dropb?: string;

  @IsOptional()
  @IsString()
  atividades_cooperados?: string;

  @IsOptional()
  @IsString()
  outras_ativd_profissionais?: string;

  // Banking
  @IsOptional()
  @IsString()
  @MaxLength(200)
  banco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  agencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  conta_corrente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pix?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  capital_social?: string;

  // Documents
  @IsOptional()
  @IsString()
  @MaxLength(200)
  carteira_registro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  atestados_tecnicos?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  curriculo_profissional?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descricao_sucinta?: string;

  // Financial
  @IsOptional()
  @IsString()
  @MaxLength(20)
  valor_acumulado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  valor_atual?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  valor_integralizado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  valor_var?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  parcelas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  em_aberto?: string;

  // Others
  @IsOptional()
  @IsString()
  @MaxLength(100)
  local_cadastro?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsString()
  creator?: string;
}
