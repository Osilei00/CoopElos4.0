-- Revert: Remove auth fields from collaborator
ALTER TABLE "collaborator" DROP CONSTRAINT IF EXISTS "collaborator_username_key";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "username";
ALTER TABLE "collaborator" DROP COLUMN IF EXISTS "password_hash";

-- Add username to user table
ALTER TABLE "user" ADD COLUMN "username" TEXT;
ALTER TABLE "user" ADD CONSTRAINT "user_username_key" UNIQUE ("username");
