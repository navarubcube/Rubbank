// src/models/TransacaoModel.ts

import { Conta, Prisma, PrismaClient, Transacao as PrismaTransacao } from "@prisma/client";
import { Transacao, TransacaoStatus, TransacaoTipo } from 'dtos/TransacaoDTO';
import ContaModel from 'models/ContaModel';
import UserModel from 'models/UserModel';

type TransacaoComUsuarioId = PrismaTransacao & { usuario_id: number };

const prisma = new PrismaClient();
const contaModel = new ContaModel();
const userModel = new UserModel();

export default class TransacaoModel {
  async create(transacao: Transacao, origem?: Conta, destino?: Conta): Promise<PrismaTransacao> {
    
  // Se a transação está agendada, apenas crie a transação e não realize a transferência
  if (transacao.status === TransacaoStatus.PENDENTE) {
    if (!origem || !destino) {
      throw new Error('Origem ou destino não definidos');
    }
    const [novaTransacao] = await prisma.$transaction([
      prisma.transacao.create({
        data: {
          conta_origem_id: origem.id,
          conta_destino_id: destino.id,
          valor: transacao.valor,
          tipo: transacao.tipo,
          status: transacao.status || TransacaoStatus.PENDENTE, // Adicione um valor padrão para o status
          descricao_categoria: transacao.descricao_categoria,
          data_agendada: transacao.data_agendada,
          created_at: new Date(),
          updated_at: new Date(),
        },
      }),
    ]);
    return novaTransacao;
  } else {
    if (!origem || !destino) {
      throw new Error('Origem ou destino não definidos');
    }

    // Se a transação não está agendada, realize a transferência imediatamente
    const saldoOrigemAtualizado = origem.saldo - transacao.valor;
    const saldoDestinoAtualizado = destino.saldo + transacao.valor;

    try {
      const novaTransacao = await prisma.$transaction([
        prisma.transacao.create({
          data: {
            conta_origem_id: origem.id,
            conta_destino_id: destino.id,
            valor: transacao.valor,
            tipo: transacao.tipo,
            status: transacao.status || TransacaoStatus.PENDENTE, // Adicione um valor padrão para o status
            descricao_categoria: transacao.descricao_categoria,
            created_at: new Date(),
            updated_at: new Date(),
          },
        }),
        prisma.conta.update({
          where: { id: origem.id },
          data: { saldo: saldoOrigemAtualizado },
        }),
        prisma.conta.update({
          where: { id: destino.id },
          data: { saldo: saldoDestinoAtualizado },
        }),
      ]);

      // Se a transação for bem-sucedida, atualize o status para CONCLUIDA
      const transacaoConcluida = await prisma.transacao.update({
        where: { id: novaTransacao[0].id },
        data: { status: TransacaoStatus.CONCLUIDA },
      });

      return transacaoConcluida;
    } catch (error) {
      throw error;
    }
  }
}

  // async executeScheduled(): Promise<void> {
  //   try {
  //     const now = new Date();
  //     const scheduled = await prisma.transacao.findMany({
  //       where: {
  //         data_agendada: {
  //           lte: now
  //         },
  //         status: TransacaoStatus.PENDENTE
  //       },
  //     });

  //     for (let transacao of scheduled) {
  //       // Busque a conta de origem e a conta de destino
  //       let origem = await prisma.conta.findUnique({ where: { id: transacao.conta_origem_id } });
  //       let destino = await prisma.conta.findUnique({ where: { id: transacao.conta_destino_id } });

  //       // Verifique se as contas de origem e destino foram encontradas
  //       if (!origem || !destino) {
  //         throw new Error('Conta de origem ou destino não encontrada');
  //       }
        
  //       // Realize a transferência
  //       await this.create(transacao, origem, destino);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  
  async getTransacaoById(id: string): Promise<Transacao | null> {
    try {
      const transacao = await prisma.transacao.findUnique({
        where: { id: id },
      });
  
      if (!transacao) {
        return null;
      }
  
      return {
        id: transacao.id,
        conta_origem_id: transacao.conta_origem_id,
        conta_destino_id: transacao.conta_destino_id,
        valor: transacao.valor,
        tipo: transacao.tipo as TransacaoTipo,
        status: transacao.status as TransacaoStatus,
        data_agendada: transacao.data_agendada ?? undefined,
        descricao_categoria: transacao.descricao_categoria ?? undefined,
        created_at: transacao.created_at,
        updated_at: transacao.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async getTransacoesByContaId(contaId: string, params: { startDate?: string, endDate?: string, order?: 'asc' | 'desc', mode?: 'ENVIADO' | 'RECEBIDO' }): Promise<Transacao[]> {
    try {
      const transacoes = await prisma.transacao.findMany({
        where: {
          OR: [
            { conta_origem_id: contaId },
            { conta_destino_id: contaId },
          ],
          AND: [
            { created_at: { gte: params.startDate ? new Date(params.startDate) : undefined } },
            { created_at: { lte: params.endDate ? new Date(params.endDate) : undefined } },
          ],
        },
        orderBy: {
          created_at: params.order,
        },
      });

      return transacoes
        .filter(transacao => {
          if (params.mode === 'ENVIADO') {
            return transacao.conta_origem_id === contaId;
          } else if (params.mode === 'RECEBIDO') {
            return transacao.conta_destino_id === contaId;
          } else {
            return true;
          }
        })
        .map(transacao => ({
          id: transacao.id,
          conta_origem_id: transacao.conta_origem_id,
          conta_destino_id: transacao.conta_destino_id,
          valor: transacao.valor,
          tipo: transacao.tipo as TransacaoTipo,
          status: transacao.status as TransacaoStatus,
          data_agendada: transacao.data_agendada ?? undefined,
          descricao_categoria: transacao.descricao_categoria ?? undefined,
          created_at: transacao.created_at,
          updated_at: transacao.updated_at,
        }));
    } catch (error) {
      throw error;
    }
  }
}
