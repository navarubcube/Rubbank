// src/controllers/ContaController.ts

import { Request, Response } from "express";
import { ContaIn, ContaOut } from "dtos/ContaDTO";
import ContaModel from "models/ContaModel";
import { ContaStatus } from "@prisma/client";
import bcrypt from 'bcrypt';

const contaModel = new ContaModel();
const saltRounds = 10;

export default class ContaController {

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

  updatePersonalData = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { nome_completo, email, telefone, cpf, data_nascimento } = req.body.user;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const existingUserEmail = await contaModel.getUserIdByEmail(email);
      if (existingUserEmail && existingUserEmail !== userId) {
        return res.status(400).json({ error: "Email já está em uso" });
      }
  
      const existingUserPhone = await contaModel.getUserIdByPhoneNumber(telefone);
      if (existingUserPhone && existingUserPhone !== userId) {
        return res.status(400).json({ error: "Telefone já está em uso" });
      }
  
      const existingUserCPF = await contaModel.getUserIdByCPF(cpf);
      if (existingUserCPF && existingUserCPF !== userId) {
        return res.status(400).json({ error: "CPF já está em uso" });
      }
  
      await contaModel.updatePersonalData(userId, nome_completo, email, telefone, cpf, data_nascimento);
  
      return res.json({ message: "Dados pessoais atualizados com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar dados pessoais" });
    }
  };  

  updatePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { old_password, new_password } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const currentPassword = await contaModel.getPasswordByUserId(userId);
      if (!currentPassword) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
  
      if (!bcrypt.compareSync(old_password, currentPassword)) {
        return res.status(401).json({ error: "Senha antiga não corresponde" });
      }
  
      const hashedPassword = bcrypt.hashSync(new_password, saltRounds);
      await contaModel.updatePassword(userId, hashedPassword);
  
      return res.json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar senha" });
    }
  };
  
  updateTransactionPassword = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { old_transaction_password, new_transaction_password } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "Usuário não autenticado" });
      }
  
      const currentTransactionPassword = await contaModel.getTransactionPasswordByUserId(userId);
      if (!currentTransactionPassword) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
  
      if (!bcrypt.compareSync(old_transaction_password, currentTransactionPassword)) {
        return res.status(401).json({ error: "Senha de transação antiga não corresponde" });
      }
  
      const hashedTransactionPassword = bcrypt.hashSync(new_transaction_password, saltRounds);
      await contaModel.updateTransactionPassword(userId, hashedTransactionPassword);
  
      return res.json({ message: "Senha de transação atualizada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar senha de transação" });
    }
  };

}
