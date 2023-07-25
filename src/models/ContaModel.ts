// src/models/ContaModel.ts

import { PrismaClient, Conta, Usuario, Transacao, Prisma } from '@prisma/client';


const prisma = new PrismaClient();

export default class ContaModel {

  async get(id: string): Promise<Conta | null> {
    const conta = await prisma.conta.findUnique({
      where: { id },
      include: { usuario: true },
    });
    return conta;
  }

  async getAll(): Promise<Conta[]> {
    const contas = await prisma.conta.findMany({ include: { usuario: true } });
    return contas;
  }

  async update(id: string, conta: Conta): Promise<Conta | null> {
    const updatedConta = await prisma.conta.update({
      where: { id },
      data: conta,
    });
    return updatedConta;
  }

  async delete(id: string): Promise<Conta | null> {
    const deletedConta = await prisma.conta.delete({ where: { id } });
    return deletedConta;
  }

  async getByUserId(userId: string): Promise<Conta[]> {
    const contas = await prisma.conta.findMany({
      where: { usuario_id: userId },
      include: { usuario: true },
    });
    return contas;
  }

  async getSaldoByUserId(userId: string): Promise<number> {
    const contas = await prisma.conta.findMany({
      where: { usuario_id: userId },
      select: { saldo: true },
    });
  
    const saldoTotal = contas.reduce(
      (acc, curr) => (curr.saldo ? acc + curr.saldo : acc),
      0
    );

    const formattedSaldo = saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  
    return saldoTotal;
  }  

  async deposito(id: string, valor: number): Promise<Conta | null> {
    const updatedConta = await prisma.conta.update({
      where: { id },
      data: {
        saldo: { increment: valor },
      },
    });
    return updatedConta;
  }

  async saque(id: string, valor: number): Promise<Conta | null> {
    const updatedConta = await prisma.conta.update({
      where: { id },
      data: {
        saldo: { decrement: valor },
      },
    });
    return updatedConta;
  }

  async getContaByUsuarioId(usuarioId: string) {
    return await prisma.conta.findUnique({
      where: { usuario_id: usuarioId },
    });
  }

  getUserIdByEmail = async (email: string) => {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });
    return user?.id;
  };

  getUserIdByAccountNumber = async (numero_conta: string) => {
    const account = await prisma.conta.findFirst({
      where: {
        numero_conta,
      },
    });
    return account?.usuario_id;
  };

  getUserIdByCPF = async (cpf: string) => {
    const user = await prisma.usuario.findUnique({
      where: {
        cpf,
      },
    });
    return user?.id;
  };

  getUserIdByPhoneNumber = async (telefone: string) => {
    const user = await prisma.usuario.findUnique({
      where: {
        telefone,
      },
    });
    return user?.id;
  };

  getAccountByUserId = async (userId: string) => {
    return await prisma.conta.findUnique({
      where: {
        usuario_id: userId,
      },
      include: {
        usuario: true,
      },
    });
  };  

  async getDetailsByUserId(userId: string): Promise<any> {
    const accountDetails = await prisma.conta.findUnique({
      where: { usuario_id: userId },
      include: { usuario: { include: { endereco: true } } },
    });
  
    return accountDetails;
  };

  updatePersonalData = async (userId: string, nome_completo: string, email: string, telefone: string, cpf: string, data_nascimento: Date) => {
    try {
      await prisma.usuario.update({
        where: { id: userId },
        data: { nome_completo: nome_completo, email: email, telefone: telefone, cpf: cpf, data_nascimento: new Date(data_nascimento) },
      });
      return ;
    } catch (error) {
      console.log("Erro ao atualizar os dados do usuário: ", error);
    }
  };  

  updatePassword = async (userId: string, password: string) => {
    await prisma.usuario.update({
      where: { id: userId },
      data: { password },
    });
  };

  updateTransactionPassword = async (userId: string, transactionPassword: string) => {
    const conta = await this.getContaByUsuarioId(userId);
    if (conta) {
      await prisma.conta.update({
        where: { id: conta.id },
        data: { transactionPassword },
      });
    }
  };

  async getPasswordByUserId(userId: string): Promise<string | null> {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { password: true }
    });
  
    return user?.password || null;
  };

  async getTransactionPasswordByUserId(userId: string): Promise<string | null> {
    const conta = await prisma.conta.findUnique({
      where: { usuario_id: userId },
      select: { transactionPassword: true },
    });
  
    return conta?.transactionPassword || null;
  };

}

