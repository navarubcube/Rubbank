import { PrismaClient } from '@prisma/client';
import { UserIn, UserOut, UserStatusDTO } from 'dtos/UsersDTO';
import { Request, Response } from "express";

export const prisma = new PrismaClient();

export default class UserModel {


  get = async (req: Request, res: Response) => {
    try {
      const id: string | undefined = req.userId;
    
      // Selecione os campos específicos para retornar na consulta
      const newUser = await this.prisma.usuario.findUnique({
        where: { id: id },
        select: {
          id: true,
          nome_completo: true,
          email: true,
          telefone: true,
          cpf: true,
          data_nascimento: true,
          status: true,
          contas: {
            select: {
              id: true
            }
          }
        },
      }); 
  
      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  }
  
  
  getAll = async () => {
    const users = await prisma.usuario.findMany(); 
  
    return users.map(user => ({
      id: user.id,
      nome_completo: user.nome_completo,
      email: user.email,
      cpf: user.cpf,
      data_nascimento: user.data_nascimento,
      created_at: user.created_at,
      updated_at: user.updated_at,
      status: user.status as UserStatusDTO,
      telefone: user.telefone,
      tentativas_login: user.tentativas_login,
    }));
  }
  

  delete = async (id: string) => {
    const user = await prisma.usuario.delete({
      where: { id: id },
    });

    return user;
  }

  update = async (id: string, user: UserIn) => {
    return await prisma.usuario.update({ 
      where: {
        id: id
      },
      data: {
        ...user
      }
    })
  }

  findByCPF = async (cpf: string) => {
    return await prisma.usuario.findUnique({ 
      where: {
        cpf
      }
    });
  }

  findByEmail = async (email: string) => {
    return await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
        ]
      }
    });
  }

  findByPhone = async (telefone: string) => {
    return await prisma.usuario.findFirst({ 
      where: {
        telefone
      }
    });
  };
  prisma: any;

  
  
};
