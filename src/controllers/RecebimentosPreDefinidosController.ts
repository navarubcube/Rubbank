// src/controllers/RecebimentosPreDefinidosController.ts

import { Request, Response } from "express";
import { RecebimentosPreDefinidosIn, RecebimentosPreDefinidosOut } from "dtos/RecebimentosPreDefinidosDTO";
import RecebimentosPreDefinidosModel from "models/RecebimentosPreDefinidosModel";

const recebimentosPreDefinidosModel = new RecebimentosPreDefinidosModel();

export default class RecebimentosPreDefinidosController {
  create = async (req: Request, res: Response) => {
    try {
      const recebimentoPreDefinido: RecebimentosPreDefinidosIn = req.body;
      const newRecebimentoPreDefinido: RecebimentosPreDefinidosOut = await recebimentosPreDefinidosModel.create(
        recebimentoPreDefinido
      );
      res.status(201).json(newRecebimentoPreDefinido);
    } catch (e) {
      console.log("Failed to create recebimento predefinido", e);
      res.status(500).send({
        error: "RCPD-01",
        message: "Failed to create recebimento predefinido",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const recebimentoPreDefinido: RecebimentosPreDefinidosOut | null = await recebimentosPreDefinidosModel.get(
        id
      );

      if (recebimentoPreDefinido) {
        res.status(200).json(recebimentoPreDefinido);
      } else {
        res.status(404).json({
          error: "RCPD-06",
          message: "Recebimento predefinido not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get recebimento predefinido", e);
      res.status(500).send({
        error: "RCPD-02",
        message: "Failed to get recebimento predefinido",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const recebimentosPreDefinidos: RecebimentosPreDefinidosOut[] | null = await recebimentosPreDefinidosModel.getAll();
      res.status(200).json(recebimentosPreDefinidos);
    } catch (e) {
      console.log("Failed to get all recebimentos predefinidos", e);
      res.status(500).send({
        error: "RCPD-03",
        message: "Failed to get all recebimentos predefinidos",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const recebimentoPreDefinidoToUpdate: RecebimentosPreDefinidosIn = req.body;
      const recebimentoPreDefinidoUpdated: RecebimentosPreDefinidosOut | null = await recebimentosPreDefinidosModel.update(
        id,
        recebimentoPreDefinidoToUpdate
      );

      if (recebimentoPreDefinidoUpdated) {
        res.status(200).json(recebimentoPreDefinidoUpdated);
      } else {
        res.status(404).json({
          error: "RCPD-06",
          message: "Recebimento predefinido não encontrado.",
        });
      }
    } catch (e) {
      console.log("Failed to update recebimento predefinido", e);
      res.status(500).send({
        error: "RCPD-04",
        message: "Failed to update recebimento predefinido",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const recebimentoPreDefinidoDeleted = await recebimentosPreDefinidosModel.delete(id);
      res.status(204).json(recebimentoPreDefinidoDeleted);
    } catch (e) {
      console.log("Failed to delete recebimento predefinido", e);
      res.status(500).send({
        error: "RCPD-05",
        message: "Failed to delete recebimento predefinido",
      });
    }
  };
}
