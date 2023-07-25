// src/controllers/RecebimentosPreDefinidosController.ts

import { Request, Response } from "express";
import RecebimentosPreDefinidosModel from "models/RecebimentosPreDefinidosModel";

const recebimentosPreDefinidosModel = new RecebimentosPreDefinidosModel();

export default class RecebimentosPreDefinidosController {
  create = async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "User is not authenticated" });
      }
  
      const newRecebimento = await recebimentosPreDefinidosModel.create(req.body, req.userId);
  
      res.status(201).json(newRecebimento);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  

  get = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const recebimento = await recebimentosPreDefinidosModel.get(id);
      if (!recebimento) {
        return res.status(404).json({ message: "Recebimento not found" });
      }
      res.json(recebimento);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (_: Request, res: Response) => {
    try {
      const recebimentos = await recebimentosPreDefinidosModel.getAll();
      res.json(recebimentos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatedRecebimento = await recebimentosPreDefinidosModel.update(id, req.body);
      if (!updatedRecebimento) {
        return res.status(404).json({ message: "Recebimento not found" });
      }
      res.json(updatedRecebimento);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const wasDeleted = await recebimentosPreDefinidosModel.delete(id);
      if (!wasDeleted) {
        return res.status(404).json({ message: "Recebimento not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getByContaDestino = async (req: Request, res: Response) => {
    try {
      const contaDestinoId = req.params.contaDestinoId;
      const recebimentos = await recebimentosPreDefinidosModel.getByContaDestino(contaDestinoId);
      res.json(recebimentos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}


