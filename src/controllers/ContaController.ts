// src/controllers/ContaController.ts

import { Request, Response } from "express";
import { ContaIn, ContaOut } from "dtos/ContaDTO";
import ContaModel from "models/ContaModel";
import { ContaStatus } from "@prisma/client";


const contaModel = new ContaModel();

export default class ContaController {

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { nome_completo, data_nascimento, endereco, password, transactionPassword } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      // Converte a data de nascimento para um objeto Date
      const dataNascimentoDate = new Date(data_nascimento);
  
      const updatedUser = await contaModel.updateUserDetails(userId, { nome_completo, data_nascimento: dataNascimentoDate, endereco, password });
  
      // Atualiza a senha de transação
      if (transactionPassword) {
        await contaModel.updateTransactionPassword(userId, transactionPassword);
      }
  
      return res.json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao atualizar detalhes do usuário" });
    }
  };  

  updateTransactionPassword = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { transactionPassword } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const updatedUser = await contaModel.updateTransactionPassword(userId, transactionPassword);
  
      return res.json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao atualizar senha de transação" });
    }
  };

  getDetails = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const accountDetails = await contaModel.getDetailsByUserId(userId);
  
      const response = {
        agencia: accountDetails.agencia,
        numero_conta: accountDetails.numero_conta,
        usuario: {
          nome_completo: accountDetails.usuario.nome_completo,
          email: accountDetails.usuario.email,
          telefone: accountDetails.usuario.telefone,
          cpf: accountDetails.usuario.cpf,
          data_nascimento: accountDetails.usuario.data_nascimento,
        },
        endereco: {
          cep: accountDetails.usuario.endereco.cep,
          endereco: accountDetails.usuario.endereco.endereco,
          numero: accountDetails.usuario.endereco.numero,
          complemento: accountDetails.usuario.endereco.complemento,
          bairro: accountDetails.usuario.endereco.bairro,
          cidade: accountDetails.usuario.endereco.cidade,
          uf: accountDetails.usuario.endereco.uf,
        },
      };
  
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao consultar detalhes da conta" });
    }
  };

  getSaldo = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const saldo = await contaModel.getSaldoByUserId(userId);
  
      const formattedSaldo = `R$ ${saldo})}`;
  
      return res.json({ saldo });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao consultar saldo" });
    }
  };
  
  

  validateCPF(cpf: string) {
    // Remover caracteres especiais do CPF
    cpf = cpf.replace(/[^\d]/g, '');
  
    // Verificar se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
  
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
  
    // Calcular o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
    // Calcular o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
    // Verificar se os dígitos verificadores estão corretos
    if (parseInt(cpf.charAt(9)) !== digit1 || parseInt(cpf.charAt(10)) !== digit2) {
      return false;
    }
  
    return true;
  }

  checkIfExists = async (req: Request, res: Response) => {
    try {
      const { input } = req.params;
  
      let user_id;
      if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(input)) {
        user_id = await contaModel.getUserIdByEmail(input);
      } else if (/^\d{7}$/.test(input)) {
        user_id = await contaModel.getUserIdByAccountNumber(input);
      } else if (/^\d{11}$/.test(input) && this.validateCPF(input)) {
        user_id = await contaModel.getUserIdByCPF(input);
      } else if (/^\d{10,11}$/.test(input)) {
        user_id = await contaModel.getUserIdByPhoneNumber(input);
      }
  
      if (!user_id) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
  
      const account = await contaModel.getAccountByUserId(user_id);

      // Checagem se a conta existe
      if (!account) {
        return res.status(404).json({ error: "Conta não encontrada" });
      }

      // Verifique se o status da conta está ativo
      if (account.status !== ContaStatus.ATIVA) {
        return res.status(403).json({ error: "A conta não está ativa" });
      }

      // Criando o objeto resposta
      const response = {
        nome_usuario: account.usuario.nome_completo,
        usuario_id: account.usuario_id,
        agencia: account.agencia,
        numero_conta: account.numero_conta,
      };
    
        return res.json(response);
      } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar a existência da conta' });
      }
  };
}
