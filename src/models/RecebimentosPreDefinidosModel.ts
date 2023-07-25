// src/models/RecebimentosPreDefinidosModel.ts

import { Prisma, PrismaClient, Conta } from '@prisma/client';
import { RecebimentosPreDefinidosAtivosOut, RecebimentosPreDefinidosIn, RecebimentosPreDefinidosOut } from '../dtos/RecebimentosPreDefinidosDTO';

const prisma = new PrismaClient();

export default class RecebimentosPreDefinidosModel {
  async create(recebimento: RecebimentosPreDefinidosIn, userId: string): Promise<RecebimentosPreDefinidosAtivosOut> {
    const account = await this.getAccountByUserId(userId);
  
    if (!account) {
      throw new Error('Account not found');
    }
  
    const currentDate = new Date();
  
    const createdRecebimento = await prisma.recebimentosPreDefinidos.create({
      data: {
        ...recebimento,
        usuario_id: userId,
        conta_destino_id: account.id,
        status: 'ATIVO', // Set status as 'ATIVO' by default
        created_at: new Date(),
      },
    });
  
    return {
      id: createdRecebimento.id,
      nome: createdRecebimento.nome,
      descricao: createdRecebimento.descricao,
      conta_destino_id: createdRecebimento.conta_destino_id,
      valor: createdRecebimento.valor,
      categoria: createdRecebimento.categoria,
    };
  }

  async get(id: string): Promise<RecebimentosPreDefinidosOut | null> {
    return await prisma.recebimentosPreDefinidos.findUnique({
      where: {
        id,
        
      },
    });
  }

  async getAll(): Promise<RecebimentosPreDefinidosAtivosOut[]> {
    return await prisma.recebimentosPreDefinidos.findMany({
      where: {
        status: 'ATIVO',
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        conta_destino_id: true,
        valor: true,
        categoria: true,
      },
    });
  }

  async update(id: string, recebimento: Partial<RecebimentosPreDefinidosIn>): Promise<RecebimentosPreDefinidosOut | null> {
    return await prisma.recebimentosPreDefinidos.update({
      where: {
        id,
      },
      data: {
        ...recebimento,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleteResponse = await prisma.recebimentosPreDefinidos.delete({
      where: {
        id,
      },
    });

    return Boolean(deleteResponse);
  }

  async getAccountByUserId(userId: string): Promise<Conta | null> {
    return await prisma.conta.findFirst({
      where: {
        usuario_id: userId,
      },
    });
  }

  async getByContaDestino(contaDestinoId: string): Promise<RecebimentosPreDefinidosAtivosOut[]> {
    return await prisma.recebimentosPreDefinidos.findMany({
      where: {
        conta_destino_id: contaDestinoId,
        status: 'ATIVO',
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        conta_destino_id: true,
        valor: true,
        categoria: true,
      },
    });
  }
}
