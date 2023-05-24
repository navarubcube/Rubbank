export interface RecebimentosPreDefinidosIn {
    usuario_id: string;
    nome: string;
    descricao?: string;
    conta_destino_id: number;
    valor: number;
    categoria?: string;
    dia_mes?: number;
    status: string;
  }
  
  export interface RecebimentosPreDefinidosOut {
    id: string;
    usuario_id: string;
    nome: string;
    descricao?: string;
    conta_destino_id: number;
    valor: number;
    categoria?: string;
    dia_mes?: number;
    status: string;
    transacoes: any[];
    created_at: Date;
  }
  