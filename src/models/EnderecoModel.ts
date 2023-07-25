// src/routes/EnderecoRoute.ts

import { PrismaClient } from '@prisma/client';
import { EnderecoIn, EnderecoOut } from 'dtos/EnderecoDTO';

const prisma = new PrismaClient();

export default class EnderecoModel {
  async update(usuario_id: string, endereco: EnderecoIn): Promise<EnderecoOut> {
    return prisma.endereco.update({
      where: { usuario_id },
      data: endereco
    });
  }
}

