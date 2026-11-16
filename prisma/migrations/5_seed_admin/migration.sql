-- AlterTable
ALTER TABLE "users" ADD COLUMN "seed_admin" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: somente os administradores criados no seed
UPDATE "users"
SET "seed_admin" = true
WHERE "email" IN (
  'daniel@gmail.com',
  'ruan@gmail.com',
  'dornelas@gmail.com',
  'gustavo@gmail.com',
  'alexandre@gmail.com',
  'felipe@gmail.com'
);
