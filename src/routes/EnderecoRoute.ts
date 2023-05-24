// src/routes/EnderecoRoute.ts

import { Router } from 'express';
import EnderecoController from 'controllers/EnderecoController';

const routes = Router();
const enderecoController = new EnderecoController();

routes.post('/', enderecoController.create);
routes.get('/', enderecoController.getAll);
routes.get('/:id', enderecoController.get);
routes.put('/:id', enderecoController.update);
routes.delete('/:id', enderecoController.delete);

export default routes;

