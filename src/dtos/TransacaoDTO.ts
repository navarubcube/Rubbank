export enum TransacaoTipo {
  DEPOSITO = 'DEPOSITO',
  SAQUE = 'SAQUE',
  TRANSFERENCIA = 'TRANSFERENCIA',
  PAGAMENTO = 'PAGAMENTO'
}

export enum TransacaoStatus {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  FALHA = 'FALHA'
}

export interface Transacao {
  id: string;
  usuario_id?: string; 
  conta_origem_id: string;
  conta_destino_id: string;
  valor: number;
  tipo: TransacaoTipo;
  status: TransacaoStatus;
  data_agendada?: Date | undefined;
  descricao_categoria?: string;
  created_at: Date;  
  updated_at: Date; 
}

