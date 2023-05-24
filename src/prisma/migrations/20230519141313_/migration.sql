/*
  Warnings:

  - The primary key for the `Conta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Endereco` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RecebimentosPreDefinidos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `agendamento_id` on the `Transacao` table. All the data in the column will be lost.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Agendamento` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `transactionPassword` on table `Conta` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_transacao_id_fkey";

-- DropForeignKey
ALTER TABLE "Conta" DROP CONSTRAINT "Conta_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "RecebimentosPreDefinidos" DROP CONSTRAINT "RecebimentosPreDefinidos_conta_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "RecebimentosPreDefinidos" DROP CONSTRAINT "RecebimentosPreDefinidos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_conta_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_conta_origem_id_fkey";

-- DropForeignKey
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_recebimento_pre_definido_id_fkey";

-- AlterTable
ALTER TABLE "Conta" DROP CONSTRAINT "Conta_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ALTER COLUMN "transactionPassword" SET NOT NULL,
ADD CONSTRAINT "Conta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Conta_id_seq";

-- AlterTable
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Endereco_id_seq";

-- AlterTable
ALTER TABLE "RecebimentosPreDefinidos" DROP CONSTRAINT "RecebimentosPreDefinidos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ALTER COLUMN "conta_destino_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RecebimentosPreDefinidos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RecebimentosPreDefinidos_id_seq";

-- AlterTable
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_pkey",
DROP COLUMN "agendamento_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "conta_origem_id" SET DATA TYPE TEXT,
ALTER COLUMN "conta_destino_id" SET DATA TYPE TEXT,
ALTER COLUMN "recebimento_pre_definido_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transacao_id_seq";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Usuario_id_seq";

-- DropTable
DROP TABLE "Agendamento";

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_conta_origem_id_fkey" FOREIGN KEY ("conta_origem_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_recebimento_pre_definido_id_fkey" FOREIGN KEY ("recebimento_pre_definido_id") REFERENCES "RecebimentosPreDefinidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecebimentosPreDefinidos" ADD CONSTRAINT "RecebimentosPreDefinidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecebimentosPreDefinidos" ADD CONSTRAINT "RecebimentosPreDefinidos_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
