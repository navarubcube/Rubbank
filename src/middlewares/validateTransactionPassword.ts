import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const validateTransactionPassword = [
  // Validações específicas para atualização da senha de transação
  check('new_transaction_password')
    .isLength({ min: 4, max: 4 }).withMessage({ message: 'Senha de transação deve ter exatamente 4 caracteres', error: 'USR-11' })
    .matches(/^[0-9]*$/).withMessage({ message: 'Senha de transação deve conter apenas números', error: 'USR-12' }),
  check('new_transaction_password_confirm')
    .custom((value, { req }) => {
      if (value !== req.body.new_transaction_password) {
        throw new Error('Confirmação de senha de transação não corresponde');
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
