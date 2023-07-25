import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class NewsletterController {
  static async create(req: Request, res: Response) {
    const data: CreateNewsletterDto = req.body;
  
    // Aqui você poderia adicionar lógica para validar `data`
  
    try {
      const newEmail = await prisma.newsletter.create({
        data,
      });
  
      return res.status(201).json(newEmail);
  
    } catch (error) {
      return res.status(500).json({ error: String(error) });
    }
  }
}
