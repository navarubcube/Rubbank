export interface EnderecoIn {
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface EnderecoOut extends EnderecoIn {
  id: string;
  usuario_id: string;
  created_at: Date;
  updated_at: Date;
}

