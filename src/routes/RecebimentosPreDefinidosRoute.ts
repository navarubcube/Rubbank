// src/routes/RecebimentosPreDefinidosRoute.ts

import { Router } from 'express';
import RecebimentosPreDefinidosController from 'controllers/RecebimentosPreDefinidosController';

const routes = Router();
const recebimentosPreDefinidosController = new RecebimentosPreDefinidosController();

routes.post('/', recebimentosPreDefinidosController.create);
routes.get('/', recebimentosPreDefinidosController.getAll);
routes.get('/:id', recebimentosPreDefinidosController.get);
routes.put('/:id', recebimentosPreDefinidosController.update);
routes.delete('/:id', recebimentosPreDefinidosController.delete);

export default routes;
