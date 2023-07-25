import { Router } from 'express';
import UserController from 'controllers/UserController';
import OnboardingController from 'controllers/OnboardingController';
import { validateUserOnboarding } from 'middlewares/validateUserOnboarding';
import { authentication } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();
const onboardingController = new OnboardingController();

routes.post('/', validateUserOnboarding, onboardingController.create);
// routes.get('/:id', authentication, userController.get); // Rota desativada, para usar rota de baixo que identifica o usuário pelo token
routes.get('/', authentication, userController.get);
routes.delete('/', authentication, userController.delete);
routes.post('/login', userController.login);
routes.post('/reactivate/:identifier', userController.initiateReactivation);
routes.post('/completeReactivation', userController.completeReactivation);
routes.post('/onboarding', userController.checkOnboarding);
// routes.get('/', authentication, userController.getAll);
// routes.put('/:id', authentication, userController.update);

export default routes;