import { PrismaClient } from '@prisma/client'
import { EnderecoIn, EnderecoOut } from 'dtos/EnderecoDTO'

const prisma = new PrismaClient()

export default class EnderecoModel {
  async create(endereco: EnderecoIn): Promise<EnderecoOut> {
    const newEndereco = await prisma.endereco.create({ data: endereco })
    return newEndereco
  }

  async get(id: number): Promise<EnderecoOut | null> {
    const endereco = await prisma.endereco.findUnique({ where: { id } })
    return endereco || null
  }

  async getAll(): Promise<EnderecoOut[] | null> {
    const enderecos = await prisma.endereco.findMany()
    return enderecos
  }

  async update(id: number, endereco: EnderecoIn): Promise<EnderecoOut | null> {
    const updatedEndereco = await prisma.endereco.update({
      where: { id },
      data: endereco,
    })
    return updatedEndereco
  }

  async delete(id: number): Promise<void> {
    await prisma.endereco.delete({ where: { id } })
  }
}
