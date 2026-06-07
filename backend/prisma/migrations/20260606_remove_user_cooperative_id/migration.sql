-- Remove cooperative_id from user table (single cooperative mode)
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_cooperative_id_fkey";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_cooperative_id_email_key";
ALTER TABLE "user" DROP COLUMN IF EXISTS "cooperative_id";

-- Add unique constraint on email only (no longer per cooperative)
ALTER TABLE "user" ADD CONSTRAINT "user_email_key" UNIQUE ("email");
