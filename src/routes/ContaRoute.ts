// src/routes/ContaRoute.ts

import { Router } from 'express';
import ContaController from 'controllers/ContaController';
import { authentication } from 'middlewares/auth';
import { validatePersonalData } from 'middlewares/validatePersonalData';
import { validateUpdatePassword } from 'middlewares/validateUpdatePassword';
import { validateTransactionPassword } from 'middlewares/validateTransactionPassword';



const routes = Router();
const contaController = new ContaController();

routes.get('/saldo',authentication, contaController.getSaldo);
routes.get('/verificar/:input',authentication, contaController.checkIfExists);
routes.get('/detalhes', authentication, contaController.getDetails);
routes.put('/dados-pessoais', authentication, validatePersonalData, contaController.updatePersonalData);
routes.put('/senha', authentication, validateUpdatePassword, contaController.updatePassword);
routes.put('/senha-transacao', authentication, validateTransactionPassword, contaController.updateTransactionPassword);

// routes.post('/', contaController.create);
// routes.put('/:id', contaController.update);
// routes.delete('/:id', contaController.delete);

export default routes;