-- CreateEnum
CREATE TYPE "UsuarioStatus" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "ContaStatus" AS ENUM ('ATIVA', 'INATIVA', 'SUSPENSA');

-- CreateEnum
CREATE TYPE "TransacaoStatus" AS ENUM ('PENDENTE', 'CONCLUIDA', 'CANCELADA', 'FALHA');

-- CreateEnum
CREATE TYPE "TransacaoTipo" AS ENUM ('DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'PAGAMENTO');

-- CreateEnum
CREATE TYPE "IntervaloRepeticao" AS ENUM ('DIARIO', 'SEMANAL', 'MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "RecebimentoStatus" AS ENUM ('ATIVO', 'INATIVO', 'DELETADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "status" "UsuarioStatus" NOT NULL,
    "password" TEXT,
    "tentativas_login" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "agencia" TEXT NOT NULL,
    "numero_conta" TEXT NOT NULL,
    "transactionPassword" TEXT,
    "nome" TEXT,
    "saldo" DOUBLE PRECISION NOT NULL,
    "status" "ContaStatus" NOT NULL,
    "senha_transacao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" SERIAL NOT NULL,
    "conta_origem_id" INTEGER NOT NULL,
    "conta_destino_id" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TransacaoTipo" NOT NULL,
    "agendamento_id" INTEGER,
    "status" "TransacaoStatus" NOT NULL,
    "recebimento_pre_definido_id" INTEGER,
    "descricao_categoria" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "transacao_id" INTEGER NOT NULL,
    "data_agendada" TIMESTAMP(3) NOT NULL,
    "repetir" BOOLEAN NOT NULL,
    "intervalo" "IntervaloRepeticao",
    "vezes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecebimentosPreDefinidos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "conta_destino_id" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT,
    "dia_mes" INTEGER,
    "status" "RecebimentoStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecebimentosPreDefinidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefone_key" ON "Usuario"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_usuario_id_key" ON "Endereco"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_usuario_id_key" ON "Conta"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_transacao_id_key" ON "Agendamento"("transacao_id");

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
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_transacao_id_fkey" FOREIGN KEY ("transacao_id") REFERENCES "Transacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecebimentosPreDefinidos" ADD CONSTRAINT "RecebimentosPreDefinidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecebimentosPreDefinidos" ADD CONSTRAINT "RecebimentosPreDefinidos_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
