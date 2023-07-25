// src/routes/RecebimentosPreDefinidosRoute.ts

import { Router } from 'express';
import RecebimentosPreDefinidosController from 'controllers/RecebimentosPreDefinidosController';
import { authentication } from 'middlewares/auth';

const routes = Router();
const recebimentosPreDefinidosController = new RecebimentosPreDefinidosController();

routes.post('/',authentication, recebimentosPreDefinidosController.create);
routes.get('/',authentication, recebimentosPreDefinidosController.getAll);
routes.get('/:id',authentication, recebimentosPreDefinidosController.get);
routes.put('/:id',authentication, recebimentosPreDefinidosController.update);
routes.delete('/:id',authentication, recebimentosPreDefinidosController.delete);
routes.get('/conta/:contaDestinoId', authentication, recebimentosPreDefinidosController.getByContaDestino);


export default routes;
