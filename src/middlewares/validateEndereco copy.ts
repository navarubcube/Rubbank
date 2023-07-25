import { EnderecoIn, EnderecoOut } from 'dtos/EnderecoDTO';
import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';


export const validateEndereco = [

  // Validar campos de endereço
  check('endereco.cep')
    .matches(/^\d{5}-\d{3}$/)
    .withMessage({ message: 'CEP inválido. Formato esperado: xxxxx-xxx', error: 'USR-17' }),
  check('endereco.endereco').notEmpty().withMessage({ message: 'Endereço é obrigatório', error: 'USR-18' }),
  check('endereco.numero').notEmpty().withMessage({ message: 'Número é obrigatório', error: 'USR-19' }),
  check('endereco.bairro').notEmpty().withMessage({ message: 'Bairro é obrigatório', error: 'USR-20' }),
  check('endereco.cidade').notEmpty().withMessage({ message: 'Cidade é obrigatória', error: 'USR-21' }),
  check('endereco.uf')
    .isLength({ min: 2, max: 2 })
    .withMessage({ message: 'UF inválida. Deve ter 2 caracteres', error: 'USR-22' }),
  
  // Verificação de erros
(req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
},
];
