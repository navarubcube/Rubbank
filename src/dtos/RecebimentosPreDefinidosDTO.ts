// src/dtos/RecebimentosPreDefinidosDTO.ts

import { RecebimentoStatus } from '@prisma/client';


export interface RecebimentosPreDefinidosIn {
    usuario_id: string;
    nome: string;
    descricao?: string | null;
    conta_destino_id: string;
    valor: number;
    categoria?: string | null;
    dia_mes?: number | null;
    status: RecebimentoStatus;
    updated_at: Date; 
  }
  
  export interface RecebimentosPreDefinidosOut {
    id: string;
    usuario_id: string;
    nome: string;
    descricao?: string | null;
    conta_destino_id: string;
    valor: number;
    categoria?: string | null;
    dia_mes?: number | null;
    status: RecebimentoStatus;
    transacoes?: any[];
    created_at: Date;
  }
  
  export interface RecebimentosPreDefinidosAtivosOut {
    id: string;
    nome: string;
    descricao?: string | null;
    conta_destino_id: string;
    valor: number;
    categoria?: string | null;
  }