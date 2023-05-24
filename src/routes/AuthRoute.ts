// src/routes/AuthRoute.ts

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import UserController from 'controllers/UserController';

const routes = Router();
const userController = new UserController();

routes.post(
  '/login',
  [
    body('cpf').isNumeric(),
    body('senha').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpf, senha } = req.body;

    const user = await userController.findByCPF(cpf);

    if (!user) {
      return res.status(404).json({
        message: 'CPF não encontrado',
      });
    }

    if (user.senha !== senha) {
      return res.status(401).json({
        message: 'Senha incorreta',
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
      },
    });
  },
);

export default routes;
