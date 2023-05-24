// src/routes/ContaRoute.ts

import { Router } from 'express';
import ContaController from 'controllers/ContaController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const contaController = new ContaController();

routes.get('/saldo',authentication, contaController.getSaldo);
routes.get('/verificar/:input',authentication, contaController.checkIfExists);
routes.get('/detalhes', authentication, contaController.getDetails);
routes.put('/detalhes', authentication, contaController.update);
// routes.post('/', contaController.create);
// routes.put('/:id', contaController.update);
// routes.delete('/:id', contaController.delete);

export default routes;