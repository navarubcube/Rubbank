// src/controllers/EnderecoController.ts 

import { Request, Response } from "express";
import { EnderecoIn, EnderecoOut } from "dtos/EnderecoDTO";
import EnderecoModel from "models/EnderecoModel";

const enderecoModel = new EnderecoModel();

export default class EnderecoController {
  async update(req: Request, res: Response): Promise<Response> {
    const userId = req.userId; // Pegando o userId da requisição
    const endereco: EnderecoIn = req.body.endereco;

    if (!userId) {
      return res.status(400).json({ error: 'userId não fornecido.' });
    }

    try {
      const updatedEndereco: EnderecoOut = await enderecoModel.update(userId, endereco);
      return res.status(200).json(updatedEndereco);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar endereço.' });
    }
  }
}