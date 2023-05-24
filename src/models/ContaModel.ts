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

  async updateUserDetails(userId: string, userDetails: any): Promise<Usuario | null> {
    const { endereco, ...rest } = userDetails;
  
    await prisma.endereco.update({
      where: { usuario_id: userId },
      data: endereco,
    });
  
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: rest,
    });
  
    return updatedUser;
  }
  
  async updateTransactionPassword(userId: string, transactionPassword: string): Promise<Conta | null> {
    const updatedConta = await prisma.conta.update({
      where: { usuario_id: userId },
      data: { transactionPassword },
    });
    return updatedConta;
  }
  
  
}

