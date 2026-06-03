-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'rh', 'dp', 'viewer');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('masculine', 'feminine');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('single', 'married', 'divorced', 'widowed', 'other');

-- CreateEnum
CREATE TYPE "CollaboratorStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('draft', 'processing', 'closed', 'cancelled');

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
    "cooperative_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'viewer',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborator" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "nis_pis" TEXT,
    "birth_date" TIMESTAMP(3),
    "birthplace" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'BRASILEIRA',
    "gender" "Gender",
    "marital_status" "MaritalStatus",
    "education_level" TEXT,
    "father_name" TEXT,
    "mother_name" TEXT,
    "mobile_phone" TEXT,
    "home_phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "neighborhood" TEXT,
    "address_complement" TEXT,
    "postal_code" TEXT,
    "city" TEXT,
    "state" VARCHAR(2),
    "status" "CollaboratorStatus" NOT NULL DEFAULT 'active',
    "admission_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "spouse_name" TEXT,
    "spouse_cpf" TEXT,

    CONSTRAINT "collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adhesion_form" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "registration_number" INTEGER,
    "registration_location" TEXT,
    "registration_date" TIMESTAMP(3),
    "referrer_name" TEXT,
    "referrer_phone" TEXT,
    "referrer_email" TEXT,
    "bank_name" TEXT,
    "bank_branch" TEXT,
    "bank_account" TEXT,
    "pix_key" TEXT,
    "company_name" TEXT,
    "desired_position" TEXT,
    "hired_position" TEXT,
    "salary" DECIMAL(10,2),
    "work_card" TEXT,
    "social_capital" DECIMAL(10,2),
    "integrated_value" DECIMAL(10,2),
    "accumulated_value" DECIMAL(10,2),
    "current_value" DECIMAL(10,2),
    "primary_activity" TEXT,
    "secondary_activity" TEXT,
    "other_activities" JSONB,
    "other_professional_activities" TEXT,
    "has_registration_card" BOOLEAN NOT NULL DEFAULT false,
    "has_technical_certificates" BOOLEAN NOT NULL DEFAULT false,
    "has_cv" BOOLEAN NOT NULL DEFAULT false,
    "brief_description" TEXT,
    "installments" INTEGER,
    "first_due_date" TIMESTAMP(3),
    "manager_email" TEXT,
    "profile_image_url" TEXT,
    "declaration_terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "signature_url" TEXT,
    "external_id" TEXT,
    "slug" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adhesion_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_url" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "payroll_item" (
    "id" TEXT NOT NULL,
    "payroll_id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "gross_salary" DECIMAL(10,2) NOT NULL,
    "hours_worked" DECIMAL(5,2),
    "overtime_hours" DECIMAL(5,2),
    "night_hours" DECIMAL(5,2),
    "discounts" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "net_salary" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sheet_hospital" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "schedule_data" JSONB NOT NULL,
    "total_hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_sheet_hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_sheet_sad" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
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
CREATE TABLE "vacation" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_history" (
    "id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "position" TEXT,
    "salary" DECIMAL(10,2) NOT NULL,
    "change_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_history_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "cooperative_cnpj_key" ON "cooperative"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "user_cooperative_id_email_key" ON "user"("cooperative_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "collaborator_cooperative_id_cpf_key" ON "collaborator"("cooperative_id", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "adhesion_form_collaborator_id_key" ON "adhesion_form"("collaborator_id");

-- CreateIndex
CREATE UNIQUE INDEX "adhesion_form_external_id_key" ON "adhesion_form"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_cooperative_id_year_month_key" ON "payroll"("cooperative_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "time_sheet_hospital_collaborator_id_year_month_key" ON "time_sheet_hospital"("collaborator_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "time_sheet_sad_collaborator_id_patient_id_year_month_key" ON "time_sheet_sad"("collaborator_id", "patient_id", "year", "month");

-- CreateIndex
CREATE INDEX "task_cooperative_id_status_due_date_idx" ON "task"("cooperative_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "audit_log_cooperative_id_created_at_idx" ON "audit_log"("cooperative_id", "created_at");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborator" ADD CONSTRAINT "collaborator_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adhesion_form" ADD CONSTRAINT "adhesion_form_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item" ADD CONSTRAINT "payroll_item_payroll_id_fkey" FOREIGN KEY ("payroll_id") REFERENCES "payroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_item" ADD CONSTRAINT "payroll_item_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_hospital" ADD CONSTRAINT "time_sheet_hospital_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_sad" ADD CONSTRAINT "time_sheet_sad_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheet_sad" ADD CONSTRAINT "time_sheet_sad_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_history" ADD CONSTRAINT "contract_history_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_cooperative_id_fkey" FOREIGN KEY ("cooperative_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
