// src/routes/EnderecoRoute.ts

import { Router } from 'express';
import EnderecoController from 'controllers/EnderecoController';
import { authentication } from 'middlewares/auth';
import { validateEndereco } from 'middlewares/validateEndereco copy';

const routes = Router();
const enderecoController = new EnderecoController();

routes.put('/update',authentication, validateEndereco, enderecoController.update);

export default routes;

