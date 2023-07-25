import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const validateUpdatePassword = [
  // Validações específicas para atualização de senha
  check('new_password')
    .isLength({ min: 8 }).withMessage({ message: 'Senha deve ter pelo menos 8 caracteres', error: 'USR-03' })
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/).withMessage({ message: 'Senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial', error: 'USR-04' }),
  check('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Confirmação de senha não coincide com a senha fornecida');
      }
      return true;
    }).withMessage({ message: 'Confirmação de senha não coincide com a senha fornecida', error: 'USR-05' }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
