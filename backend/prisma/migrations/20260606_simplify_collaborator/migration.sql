-- Remove columns from collaborator table, keeping only: id, full_name, cpf, mobile_phone, email

-- Drop foreign key constraints first
ALTER TABLE "adhesion_form" DROP CONSTRAINT IF EXISTS "adhesion_form_collaborator_id_fkey";
ALTER TABLE "document" DROP CONSTRAINT IF EXISTS "document_collaborator_id_fkey";
ALTER TABLE "payroll_item" DROP CONSTRAINT IF EXISTS "payroll_item_collaborator_id_fkey";
ALTER TABLE "time_sheet_hospital" DROP CONSTRAINT IF EXISTS "time_sheet_hospital_collaborator_id_fkey";
ALTER TABLE "time_sheet_sad" DROP CONSTRAINT IF EXISTS "time_sheet_sad_collaborator_id_fkey";
ALTER TABLE "vacation" DROP CONSTRAINT IF EXISTS "vacation_collaborator_id_fkey";
ALTER TABLE "contract_history" DROP CONSTRAINT IF EXISTS "contract_history_collaborator_id_fkey";

-- Drop dependent tables first
DROP TABLE IF EXISTS "adhesion_form" CASCADE;
DROP TABLE IF EXISTS "document" CASCADE;
DROP TABLE IF EXISTS "payroll_item" CASCADE;
DROP TABLE IF EXISTS "time_sheet_hospital" CASCADE;
DROP TABLE IF EXISTS "time_sheet_sad" CASCADE;
DROP TABLE IF EXISTS "vacation" CASCADE;
DROP TABLE IF EXISTS "contract_history" CASCADE;

-- Drop unique constraint
ALTER TABLE "collaborator" DROP CONSTRAINT IF EXISTS "collaborator_cooperative_id_cpf_key";

-- Drop columns
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "cooperative_id";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "rg";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "nis_pis";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "birth_date";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "birthplace";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "nationality";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "gender";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "marital_status";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "education_level";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "father_name";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "mother_name";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "home_phone";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "address";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "neighborhood";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "address_complement";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "postal_code";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "city";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "state";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "status";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "admission_date";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "created_at";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "updated_at";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "spouse_name";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "spouse_cpf";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "ativo";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "collaborator_number";

-- Rename mobile_phone to cel for clarity
ALTER TABLE "collaborator" RENAME COLUMN "mobile_phone" TO "cel";

-- Make cpf unique
ALTER TABLE "collaborator" ADD CONSTRAINT "collaborator_cpf_key" UNIQUE ("cpf");
