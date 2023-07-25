// src/controllers/TransacaoController.ts

import { Response, NextFunction } from 'express';
import { Request } from 'middlewares/types'; 
import TransacaoModel from '../models/TransacaoModel';
import { Transacao , TransacaoStatus } from '../dtos/TransacaoDTO'; 
import { ContaStatus } from "@prisma/client";
import bcrypt from 'bcrypt';
import ContaModel from '../models/ContaModel';


const contaModel = new ContaModel();
const transacaoModel = new TransacaoModel();



class TransacaoController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const transacao: Transacao = req.body;
      
      
      // Verifique se req.userId está definido
      if (req.userId === undefined) {
        return res.status(401).json({ message: "User ID not found" });
      }

      if (transacao.usuario_id === undefined) {
        return res.status(400).json({ message: "User ID not found in transaction" });
      }
      
      // Busque a conta de origem pelo ID do usuário
      let origem = await contaModel.getContaByUsuarioId(req.userId);
      let destino = await contaModel.getContaByUsuarioId(transacao.usuario_id);

      // Verifique se transacao.valor é um número e é maior que zero
      if (typeof transacao.valor !== 'number' || transacao.valor <= 0) {
        return res.status(400).json({ message: "Valor da Transferencia deve ser maior que zero." });
      }

      if (!origem || origem.status !== ContaStatus.ATIVA || origem.saldo < transacao.valor ) {
        return res.status(400).json({ message: "Conta de origem inválida ou saldo insuficiente." });
      }

      // Verifique se a conta de origem e a conta de destino são iguais
      if (origem.id === destino?.id) {
        return res.status(400).json({ message: "A conta de origem não pode ser a mesma que a conta de destino." });
      }

      if (!destino || destino.status !== ContaStatus.ATIVA) {
        return res.status(400).json({ message: "Conta de destino inválida." });
      }

      // Verifica a senha da transação
      const passwordMatch = await bcrypt.compare(req.body.transactionPassword, origem.transactionPassword);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Senha de Transação incorreta." });
      }

      transacao.conta_origem_id = req.userId;
      // Se a data da transação for fornecida, agende a transação para essa data
      if (transacao.data_agendada) {
        transacao.status = TransacaoStatus.PENDENTE;
        const newTransacao = await transacaoModel.create(transacao,origem, destino);
        res.status(201).json(newTransacao);
      } else {
        // Caso contrário, execute a transação imediatamente
        const newTransacao = await transacaoModel.create(transacao, origem, destino);
        res.status(201).json(newTransacao);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  async getTransacaoById(req: Request, res: Response) {
    try {
      const transacaoId = req.params.id;
  
      // Verifique se req.userId está definido
      if (req.userId === undefined) {
        return res.status(401).json({ message: "User ID not found" });
      }
      
      // Use getContaByUsuarioId() para obter a conta do usuário
      const conta = await contaModel.getContaByUsuarioId(req.userId);
  
      // Verifique se a conta foi encontrada
      if (!conta) {
        return res.status(404).json({ message: "Account not found" });
      }
  
      const transacao = await transacaoModel.getTransacaoById(transacaoId);
  
      // Verifique se a transação foi encontrada
      if (!transacao) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Verifique se a conta_origem_id ou conta_destino_id da transação é igual ao conta.id do usuário
      if (transacao.conta_origem_id !== conta.id && transacao.conta_destino_id !== conta.id) {
        return res.status(403).json({ message: "You do not have permission to access this transaction" });
      }

      // Crie um novo objeto que inclui todas as propriedades da transação e a propriedade adicional "modo"
      const transacaoComModo = {
        ...transacao,
        modo: transacao.conta_origem_id === conta.id ? 'ENVIADO' : 'RECEBIDO',
      };
  
      return res.json(transacaoComModo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao obter a transação' });
    }
  };
  
  async getTransacoes(req: Request, res: Response) {
    try {
      // Verifique se req.userId está definido
      if (req.userId === undefined) {
        return res.status(401).json({ message: "User ID not found" });
      }
      
      // Use getContaByUsuarioId() para obter a conta do usuário
      const conta = await contaModel.getContaByUsuarioId(req.userId);
  
      // Verifique se a conta foi encontrada
      if (!conta) {
        return res.status(404).json({ message: "Account not found" });
      }

      const params = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        order: req.query.order as 'desc' | 'asc',
        mode: req.query.mode as 'ENVIADO' | 'RECEBIDO',
        page: parseInt(req.query.page as string) || 1, // Página atual, padrão: 1
        limit: parseInt(req.query.limit as string) || 15, // Resultados por página, padrão: 10
      };


      const transacoes = await transacaoModel.getTransacoesByContaId(conta.id, params);

      // Crie um novo objeto que inclui todas as propriedades da transação e a propriedade adicional "modo"
      const transacoesComModo= transacoes.map(transacao => ({
        ...transacao,
        modo: transacao.conta_origem_id === conta.id ? 'ENVIADO' : 'RECEBIDO',
      }));
  
      // Paginação
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = params.page * params.limit;
      const results = transacoesComModo.slice(startIndex, endIndex);
  
      return res.json({
        count: transacoesComModo.length,
        currentPage: params.page,
        totalPages: Math.ceil(transacoesComModo.length / params.limit),
        results,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao obter as transações' });
    }
  }
}

export default TransacaoController;

