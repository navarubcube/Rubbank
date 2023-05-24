import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { UserIn, UserOut, UserStatusDTO } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto';

const userModel = new UserModel();

export default class UserController {

  constructor() {
    this.prisma = new PrismaClient();
  }  

  initiateReactivation = async (req: Request, res: Response) => {
    try {
      const identifier: string = req.params.identifier;
  
      if (!identifier) {
        return res.status(400).json({
          error: "USR-08",
          message: "Invalid identifier parameter. Expected a string value."
        });
      }
      
      // Verificar se o identifier é um e-mail, um CPF ou um telefone
      const isEmail = /\S+@\S+\.\S+/.test(identifier);
      const isCPF = /^\d{11}$/.test(identifier);
      const isPhone = /^[1-9]{2}[-. ]?[2-9]{1}[0-9]{3}[-. ]?[0-9]{4}$/.test(identifier);
      
      let user = null;

      if (isEmail) {
        user = await userModel.findByEmail(identifier);
      } else if (isCPF) {
        user = await userModel.findByCPF(identifier);
      } else if (isPhone) {
        user = await userModel.findByPhone(identifier);
      } else {
        return res.status(400).json({ message: "Identificador inválido. Deve ser um e-mail, um CPF ou um telefone." });
      }

      if (user) {
        // id must be defined
        const id = user.id;

        // Fetch the user again
        user = await this.prisma.usuario.findUnique({ where: { id: id } });
      }
  
      if (user) {
        // Generate a new activation code
        const activationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  
        // Update the user's activation code in the database
        await this.prisma.usuario.update({
          where: { id: user.id },
          data: { reactivation_code: activationCode }
        });
  
        res.status(200).json({
          message: "Email de reativação enviado",
          user_id: user.id,
          reactivation_code: activationCode
        });
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to initiate reactivation", e);
      res.status(500).send({
        error: "USR-09",
        message: "Failed to initiate reactivation",
      });
    }
  }
  

  completeReactivation = async (req: Request, res: Response) => {
    try {
      const { id, activationCode } = req.body;
  
      let user = await this.prisma.usuario.findUnique({ where: { id: id } });

      if (!user) {
        return res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }

      if (user.reactivation_code !== activationCode) {
        return res.status(400).json({
          error: "USR-10",
          message: "Invalid activation code.",
        });
      }

      // Atualizar o status do usuário para 'ATIVO', limpar o código de ativação e zere o campo tentativas_login
      user = await this.prisma.usuario.update({
        where: { id: id },
        data: { status: 'ATIVO', reactivation_code: null, tentativas_login: 0 }
      });

      res.status(200).json({
        message: "Account reactivated successfully"
      });
    } catch (e) {
      console.log("Failed to complete reactivation", e);
      res.status(500).send({
        error: "USR-11",
        message: "Failed to complete reactivation",
      });
    }
  }


  get = async (req: Request, res: Response) => {
    try {
      const id: string | undefined = req.userId;
      
      // Verificar se o id na rota é o mesmo que o id no token
      // if (id !== req.userId) {
      //   return res.status(403).json({
      //     error: "USR-12",
      //     message: "Você não está autorizado a acessar os dados deste usuário."
      //   });
      // }
  
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
 
  // getAll = async (req: Request, res: Response) => {
  //   try {
  //     const id: string | undefined = req.params.id;

  //     const users: UserOut[] | null = await this.prisma.usuario.findMany({
  //       where: { status: 'ATIVO',  id: id },
        
  //     });
  //     res.status(200).json(users);
  //   } catch (e) {
  //     console.log("Failed to get all users", e);
  //     res.status(500).send({
  //       error: "USR-03",
  //       message: "Failed to get all users",
  //     });
  //   }
  // };

  delete = async (req: Request, res: Response) => {
    try {
      const id: string | undefined = req.userId;


      const userUpdated = await this.prisma.usuario.update({
        where: { id: id },
        data: { status: 'INATIVO' }, // ou 'SUSPENSO'
        select: {
          id: true,
          nome_completo: true,
          status: true,
        },
      });

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to delete (deactivate) user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete (deactivate) user",
      });
    }
  };

  findByCPF = async (cpf: string) => {
    return await userModel.findByCPF(cpf);
  };

  login = async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
  
      // Verificar se o identifier é um e-mail ou um CPF
      const isEmail = /\S+@\S+\.\S+/.test(identifier);
      const isCPF = /^\d{11}$/.test(identifier);
  
      let user = null;
  
      if (isEmail) {
        // Encontre o usuário pelo e-mail
        user = await this.prisma.usuario.findUnique({ where: { email: identifier } });
      } else if (isCPF) {
        // Encontre o usuário pelo CPF
        user = await this.prisma.usuario.findUnique({ where: { cpf: identifier } });
      } else {
        return res.status(400).json({ message: "Identificador inválido. Deve ser um e-mail ou um CPF." });
      }
  
      // Se o usuário não existir
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          identifierType: isEmail ? 'email' : 'cpf',
          identifier: identifier
        });
      }
      
      // Verificar se o status do usuário é 'ATIVO'
      if (user.status !== 'ATIVO') {
        return res.status(403).json({ message: "Conta de usuário inativa ou suspensa.", error: 'USR-23' });
      }
  
      // Se a senha não existir ou não corresponder, retorne um erro
      if (!user.password || !(await bcrypt.compare(password, user.password))) {
        // Incrementar a contagem de tentativas de login
        user = await this.prisma.usuario.update({
          where: { id: user.id },
          data: { tentativas_login: { increment: 1 } }
        });

        // Se exceder 3 tentativas de login, suspenda o usuário
        if (user.tentativas_login >= 3) {
          user = await this.prisma.usuario.update({
            where: { id: user.id },
            data: { status: 'SUSPENSO' }
          });
        }

        return res.status(400).json({ message: "Senha errada" });
      }


      // Zerar a contagem de tentativas de login após o login bem-sucedido
      user = await this.prisma.usuario.update({
        where: { id: user.id },
        data: { tentativas_login: 0 }
      });
  
      // Gere um token JWT
      const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '1d'  // o token expira em 1 dia
      });
  
      // Retorne o token JWT e a URL da página inicial
      res.json({ 
        token: jwtToken, 
        homeUrl: "https://www.rubbank.com/"  // altere isso para a URL da sua página inicial
      });
  
    } catch (e) {
      console.log("Failed to login", e);
      res.status(500).send({
        error: "USR-07",
        message: "Failed to login",
      });
    }
  };
  
  
  

  prisma: any;
  
  
}
