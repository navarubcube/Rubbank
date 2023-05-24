// src/dtos/ContaDTO.ts

export interface ContaIn {
    usuario_id: string;
    agencia: string;
    numero_conta: string;
    nome?: string;
    saldo?: number;
    status?: string;
  }
  
  export interface ContaOut {
    id: string;
    usuario_id: string;
    agencia: string;
    numero_conta: string;
    nome?: string;
    saldo: number;
    status: string;
    created_at: string;
    updated_at: string;
    transactionPassword: string;
  }

  export interface ContaTransactionPasswordIn {
    usuario_id: string;
    transactionPassword: string;
  }
  