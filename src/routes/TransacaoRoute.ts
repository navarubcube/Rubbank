// src/routes/TransacaoRoute.ts

import { Router } from 'express';
import TransacaoController from '../controllers/TransacaoController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const transacaoController = new TransacaoController();

routes.post('/', authentication, transacaoController.create.bind(transacaoController));
routes.get('/', authentication, transacaoController.getTransacoes.bind(transacaoController));
routes.get('/:id', authentication, transacaoController.getTransacaoById.bind(transacaoController));
// routes.get('/enviadas', authentication, transacaoController.getTransacoesEviadas);
// routes.get('/recebidas', authentication, transacaoController.getTransacoesRecebidas);
// routes.get('/', transacaoController.getAll.bind(transacaoController));
// routes.get('/:id', transacaoController.get.bind(transacaoController));
// routes.put('/:id', transacaoController.update.bind(transacaoController));
// routes.delete('/:id', transacaoController.delete.bind(transacaoController));

export default routes;


