-- Add authentication fields to collaborator table
ALTER TABLE "collaborator" ADD COLUMN "username" TEXT;
ALTER TABLE "collaborator" ADD COLUMN "password_hash" TEXT;

-- Create unique index on username
ALTER TABLE "collaborator" ADD CONSTRAINT "collaborator_username_key" UNIQUE ("username");
