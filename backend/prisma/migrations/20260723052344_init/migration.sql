-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'rh', 'dp', 'viewer');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('draft', 'processing', 'closed', 'cancelled');

-- CreateEnum
CREATE TYPE "VacationStatus" AS ENUM ('scheduled', 'approved', 'taken', 'cancelled');

-- CreateTable
CREATE TABLE "cooperative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "logo_url" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cooperative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'viewer',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "username" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'draft',
    "total_gross" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_discounts" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_net" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "creator_id" TEXT NOT NULL,
    "assignee_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_url" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cooperado" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "cooperado_number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "nome_cooperado" TEXT,
    "cpf_cooperado" TEXT,
    "rg" TEXT,
    "nis_pis" TEXT,
    "ctps_serie" TEXT,
    "nacionalidade" TEXT,
    "naturalidade" TEXT,
    "nascimento" TIMESTAMP(3),
    "sexo" TEXT,
    "estado_civil" TEXT,
    "escolaridade" TEXT,
    "nome_pai" TEXT,
    "nome_mae" TEXT,
    "nome_conjuge" TEXT,
    "cpf_conjuge" TEXT,
    "celular_cooperado" TEXT,
    "telefone_residencial" TEXT,
    "email_cooperado" TEXT,
    "celular_indicador" TEXT,
    "email_indicador" TEXT,
    "nome_indicacao" TEXT,
    "email_gestor" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "complemento" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "empresa_trabalho" TEXT,
    "cargo_pretendido" TEXT,
    "cargo_contratado" TEXT,
    "salario" TEXT,
    "data_admissao" TIMESTAMP(3),
    "data_cadastro" TIMESTAMP(3),
    "ativ_coop_dropa" TEXT,
    "ativ_coop_dropb" TEXT,
    "atividades_cooperados" TEXT,
    "outras_ativd_profissionais" TEXT,
    "banco" TEXT,
    "agencia" TEXT,
    "conta_corrente" TEXT,
    "pix" TEXT,
    "capital_social" TEXT,
    "carteira_registro" TEXT,
    "atestados_tecnicos" TEXT,
    "curriculo_profissional" TEXT,
    "descricao_sucinta" TEXT,
    "documentos" TEXT,
    "valor_acumulado" TEXT,
    "valor_atual" TEXT,
    "valor_integralizado" TEXT,
    "valor_var" TEXT,
    "parcelas" TEXT,
    "em_aberto" TEXT,
    "local_cadastro" TEXT,
    "imagem_cooperado" TEXT,
    "declaracao_adesao_url" TEXT,
    "recibo_contribuicao_url" TEXT,
    "declaracao_quitacao_url" TEXT,
    "venc_cooperados" TEXT,
    "matricula" TEXT,
    "unique_id_bubble" TEXT,
    "slug" TEXT,
    "creation_date" TIMESTAMP(3),
    "modified_date" TIMESTAMP(3),
    "creator" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cooperado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_history" (
    "id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "position" TEXT,
    "salary" DECIMAL(10,2) NOT NULL,
    "change_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ficha_cooperado_form" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "venc_cooperados" TEXT,
    "matricula" TEXT,
    "unique_id_bubble" TEXT,
    "slug" TEXT,
    "nome_cooperado" TEXT,
    "cpf_cooperado" TEXT,
    "rg" TEXT,
    "nis_pis" TEXT,
    "ctps_serie" TEXT,
    "nacionalidade" TEXT,
    "naturalidade" TEXT,
    "nascimento" TIMESTAMP(3),
    "sexo" TEXT,
    "estado_civil" TEXT,
    "escolaridade" TEXT,
    "nome_pai" TEXT,
    "nome_mae" TEXT,
    "nome_conjuge" TEXT,
    "cpf_conjuge" TEXT,
    "celular_cooperado" TEXT,
    "telefone_residencial" TEXT,
    "email_cooperado" TEXT,
    "celular_indicador" TEXT,
    "email_indicador" TEXT,
    "nome_indicacao" TEXT,
    "email_gestor" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "complemento" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "empresa_trabalho" TEXT,
    "cargo_pretendido" TEXT,
    "cargo_contratado" TEXT,
    "salario" TEXT,
    "data_admissao" TIMESTAMP(3),
    "data_cadastro" TIMESTAMP(3),
    "ativ_coop_dropa" TEXT,
    "ativ_coop_dropb" TEXT,
    "atividades_cooperados" TEXT,
    "outras_ativd_profissionais" TEXT,
    "banco" TEXT,
    "agencia" TEXT,
    "conta_corrente" TEXT,
    "pix" TEXT,
    "capital_social" TEXT,
    "carteira_registro" TEXT,
    "atestados_tecnicos" TEXT,
    "curriculo_profissional" TEXT,
    "descricao_sucinta" TEXT,
    "valor_acumulado" TEXT,
    "valor_atual" TEXT,
    "valor_integralizado" TEXT,
    "valor_var" TEXT,
    "parcelas" TEXT,
    "em_aberto" TEXT,
    "local_cadastro" TEXT,
    "imagem_cooperado" TEXT,
    "creation_date" TIMESTAMP(3),
    "modified_date" TIMESTAMP(3),
    "creator" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cooperado_id" TEXT,

    CONSTRAINT "ficha_cooperado_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sheet_hospital" (
    "id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "schedule_data" JSONB NOT NULL,
    "total_hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_sheet_hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sheet_sad" (
    "id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "morning_shifts" INTEGER NOT NULL DEFAULT 0,
    "night_shifts" INTEGER NOT NULL DEFAULT 0,
    "six_by_one" INTEGER NOT NULL DEFAULT 0,
    "gross_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "meal_allowance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "quota_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "net_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_sheet_sad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribuicao" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'parcela',
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pago',
    "data_pagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recibo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contribuicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacation" (
    "id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "status" "VacationStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_item" (
    "id" TEXT NOT NULL,
    "payroll_id" TEXT NOT NULL,
    "cooperado_id" TEXT NOT NULL,
    "gross_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discounts" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cooperative_cnpj_key" ON "cooperative"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_cooperative_id_year_month_key" ON "payroll"("cooperative_id", "year", "month");

-- CreateIndex
CREATE INDEX "task_cooperative_id_status_due_date_idx" ON "task"("cooperative_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "audit_log_cooperative_id_created_at_idx" ON "audit_log"("cooperative_id", "created_at");

-- CreateIndex
CREATE INDEX "document_cooperado_id_idx" ON "document"("cooperado_id");

-- CreateIndex
CREATE UNIQUE INDEX "cooperado_cpf_cooperado_key" ON "cooperado"("cpf_cooperado");

-- CreateIndex
CREATE UNIQUE INDEX "cooperado_unique_id_bubble_key" ON "cooperado"("unique_id_bubble");

-- CreateIndex
CREATE INDEX "cooperado_cooperative_id_cpf_cooperado_idx" ON "cooperado"("cooperative_id", "cpf_cooperado");

-- CreateIndex
CREATE INDEX "contract_history_cooperado_id_created_at_idx" ON "contract_history"("cooperado_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ficha_cooperado_form_unique_id_bubble_key" ON "ficha_cooperado_form"("unique_id_bubble");

-- CreateIndex
CREATE UNIQUE INDEX "ficha_cooperado_form_cooperado_id_key" ON "ficha_cooperado_form"("cooperado_id");

-- CreateIndex
CREATE INDEX "ficha_cooperado_form_cooperative_id_cpf_cooperado_idx" ON "ficha_cooperado_form"("cooperative_id", "cpf_cooperado");

-- CreateIndex
CREATE UNIQUE INDEX "time_sheet_hospital_cooperado_id_year_month_key" ON "time_sheet_hospital"("cooperado_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "time_sheet_sad_cooperado_id_patient_id_year_month_key" ON "time_sheet_sad"("cooperado_id", "patient_id", "year", "month");

-- CreateIndex
CREATE INDEX "contribuicao_cooperative_id_mes_ano_idx" ON "contribuicao"("cooperative_id", "mes", "ano");

-- CreateIndex
CREATE INDEX "contribuicao_cooperado_id_idx" ON "contribuicao"("cooperado_id");

-- CreateIndex
CREATE UNIQUE INDEX "contribuicao_cooperado_id_mes_ano_key" ON "contribuicao"("cooperado_id", "mes", "ano");

-- CreateIndex
CREATE INDEX "vacation_cooperado_id_idx" ON "vacation"("cooperado_id");

-- CreateIndex
CREATE INDEX "payroll_item_payroll_id_idx" ON "payroll_item"("payroll_id");

-- AddForeignKey
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cooperado" ADD CONSTRAINT "cooperado_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_history" ADD CONSTRAINT "contract_history_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_cooperado_form" ADD CONSTRAINT "ficha_cooperado_form_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_cooperado_form" ADD CONSTRAINT "ficha_cooperado_form_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_hospital" ADD CONSTRAINT "time_sheet_hospital_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_sad" ADD CONSTRAINT "time_sheet_sad_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_sad" ADD CONSTRAINT "time_sheet_sad_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicao" ADD CONSTRAINT "contribuicao_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicao" ADD CONSTRAINT "contribuicao_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item" ADD CONSTRAINT "payroll_item_payroll_id_fkey" FOREIGN KEY ("payroll_id") REFERENCES "payroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item" ADD CONSTRAINT "payroll_item_cooperado_id_fkey" FOREIGN KEY ("cooperado_id") REFERENCES "cooperado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
