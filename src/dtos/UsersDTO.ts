import { EnderecoIn } from "./EnderecoDTO";

// Defina este enum no seu arquivo DTO
export enum UserStatusDTO {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  SUSPENSO = 'SUSPENSO'
}

export interface UserIn {
  nome_completo: string;
  email: string;
  cpf: string;
  data_nascimento: Date;
  created_at: Date;
  updated_at: Date;
  status: UserStatusDTO; 
  telefone: string;
  tentativas_login: number;
  password: string;
}

export interface UserOut {
  id: string;
  nome_completo: string;
  email: string;
  cpf: string;
  data_nascimento: Date;
  created_at: Date;
  updated_at: Date;
  status: UserStatusDTO; 
  telefone: string;
  tentativas_login: number;
}


