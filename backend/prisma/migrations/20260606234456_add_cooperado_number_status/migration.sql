-- AlterTable
ALTER TABLE "ficha_cooperado_form" ADD COLUMN     "cooperado_number" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
