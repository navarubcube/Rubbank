import { Request, Response } from "express";
import { EnderecoIn, EnderecoOut } from "dtos/EnderecoDTO";
import EnderecoModel from "models/EnderecoModel";

const enderecoModel = new EnderecoModel();

export default class EnderecoController {
  create = async (req: Request, res: Response) => {
    try {
      const endereco: EnderecoIn = req.body;
      const newEndereco: EnderecoOut = await enderecoModel.create(endereco);
      res.status(201).json(newEndereco);
    } catch (e) {
      console.log("Failed to create endereco", e);
      res.status(500).send({
        error: "END-01",
        message: "Failed to create endereco",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const endereco: EnderecoOut | null = await enderecoModel.get(id);

      if (endereco) {
        res.status(200).json(endereco);
      } else {
        res.status(404).json({
          error: "END-02",
          message: "Endereco not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get endereco", e);
      res.status(500).send({
        error: "END-03",
        message: "Failed to get endereco",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const enderecos: EnderecoOut[] | null = await enderecoModel.getAll();
      res.status(200).json(enderecos);
    } catch (e) {
      console.log("Failed to get all enderecos", e);
      res.status(500).send({
        error: "END-04",
        message: "Failed to get all enderecos",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateEndereco: EnderecoIn = req.body;
      const enderecoUpdated: EnderecoOut | null = await enderecoModel.update(
        id,
        updateEndereco
      );

      if (enderecoUpdated) {
        res.status(200).json(enderecoUpdated);
      } else {
        res.status(404).json({
          error: "END-02",
          message: "Endereco not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update endereco", e);
      res.status(500).send({
        error: "END-05",
        message: "Failed to update endereco",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const enderecoDeleted = await enderecoModel.delete(id);
      res.status(204).json(enderecoDeleted);
    } catch (e) {
      console.log("Failed to delete endereco", e);
      res.status(500).send({
        error: "END-06",
        message: "Failed to delete endereco",
      });
    }
  };
}
