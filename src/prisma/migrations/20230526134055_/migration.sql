/*
  Warnings:

  - Added the required column `updated_at` to the `RecebimentosPreDefinidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conta" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Endereco" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RecebimentosPreDefinidos" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transacao" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
