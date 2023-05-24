import { Request, Response } from "express";
import { PrismaClient, ContaStatus, UsuarioStatus } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default class OnboardingController {
  async create(req: Request, res: Response) {
    const { user, endereco, conta } = req.body;

    try {
      const errors = [];

      // Verificar se o e-mail já está cadastrado
      const existingEmail = await prisma.usuario.findUnique({
        where: {
          email: user.email,
        },
      });
      if (existingEmail) {
        errors.push({
          error: "USR-11",
          message: "Email já está cadastrado."
        });
      }

      // Verificar se o CPF já está cadastrado
      const existingCPF = await prisma.usuario.findUnique({
        where: {
          cpf: user.cpf,
        },
      });
      if (existingCPF) {
        errors.push({
          error: "USR-12",
          message: "CPF já está cadastrado."
        });
      }

      // Verificar se o telefone já está cadastrado
      const existingPhone = await prisma.usuario.findFirst({
        where: {
          telefone: user.telefone,
        },
      });
      if (existingPhone) {
        errors.push({
          error: "USR-13",
          message: "Telefone já está cadastrado."
        });
      }

      // Se houver erros, retorne-os agora
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
      const hashedTransactionPassword = bcrypt.hashSync(conta.transactionPassword, saltRounds);
      
      // Primeiro crie o usuário
      const newUser = await prisma.usuario.create({
        data: {
          ...user,
          password: hashedPassword, // substitua a senha pelo hash
          data_nascimento: new Date(user.data_nascimento), // Convert string to Date
          status: UsuarioStatus.ATIVO, // estado inicial do usuário
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // Pegue a conta mais recentemente criada
      const lastAccount = await prisma.conta.findFirst({
        orderBy: {
          id: 'desc',
        },
      });

      // Gere um novo número de conta com base na conta mais recente
      let newAccountNumber = lastAccount ? parseInt(lastAccount.numero_conta) + 1 : 1000000;

      // Certifique-se de que o número da conta tem 7 dígitos e os dois últimos dígitos não são 0
      while (newAccountNumber.toString().length != 7 || newAccountNumber % 100 == 0) {
        newAccountNumber += 1;
      }

      // Depois crie o endereço e a conta em uma transação, referenciando o usuário criado
      const [newEndereco, newConta] = await prisma.$transaction([
          prisma.endereco.create({
            data: {
              ...endereco,
              usuario: {
                connect: {
                  id: newUser.id
                }
              },
              created_at: new Date(),
              updated_at: new Date()
            }
          }),
          prisma.conta.create({
          data: {
            ...conta,
            agencia: process.env.AGENCY_NUMBER,
            numero_conta: newAccountNumber.toString(), // Converta para string
            saldo: 0,
            usuario: {
              connect: {
                id: newUser.id
              }
            },
            transactionPassword: hashedTransactionPassword, // Use a senha de transação hashed
            status: ContaStatus.ATIVA,
            created_at: new Date(),
            updated_at: new Date()
          }
      }),
      ]);

      // Responda com os dados criados
      res.status(201).json({
        user: {
          nome_completo: newUser.nome_completo,
          email: newUser.email,
          telefone: newUser.telefone,
          cpf: newUser.cpf,
          data_nascimento: newUser.data_nascimento
        },
        endereco: {
          cep: newEndereco.cep,
          endereco: newEndereco.endereco,
          numero: newEndereco.numero,
          complemento: newEndereco.complemento,
          bairro: newEndereco.bairro,
          cidade: newEndereco.cidade,
          uf: newEndereco.uf
        },
        conta: {
          agencia: newConta.agencia,
          numero_conta: newConta.numero_conta
        }
      });

    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "An error occurred while creating onboarding" });
    }
  }
}

