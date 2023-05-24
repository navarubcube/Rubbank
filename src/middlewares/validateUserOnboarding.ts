import { UserStatusDTO } from 'dtos/UsersDTO';
import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

function validateCPF(cpf: string) {
    // Remover caracteres especiais do CPF
    cpf = cpf.replace(/[^\d]/g, '');
  
    // Verificar se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
  
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
  
    // Calcular o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
    // Calcular o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
    // Verificar se os dígitos verificadores estão corretos
    if (parseInt(cpf.charAt(9)) !== digit1 || parseInt(cpf.charAt(10)) !== digit2) {
      return false;
    }
  
    return true;
  }

export const validateUserOnboarding = [

  // Validação de entrada usando express-validator
  check('user.nome_completo').isLength({ min: 4 }).withMessage({message: 'Nome completo é obrigatório', error: 'USR-01'}),
  check('user.email').isEmail().withMessage({ message: 'Email inválido', error: 'USR-02' }),

  // Validar campo CPF
  check('user.cpf')
  .matches(/^\d{11}$/)
  .withMessage({ message: 'CPF inválido.', error: 'USR-03' })
  .custom((value) => {
    if (!validateCPF(value)) { // Validar o CPF usando a função validateCPF
      throw new Error('CPF inválido');
    }
    return true;
  }),

  check('user.data_nascimento').isISO8601().withMessage({ message: 'Data de nascimento inválida', error: 'USR-04' }),
  check('user.telefone').matches(/^[1-9]{2}9?[0-9]{8}$/).withMessage({ message: 'Telefone inválido. Formato esperado: xx9xxxxxx-xxxx ou xx9xxxxxxxx', error: 'USR-06' }),
  check('user.tentativas_login').isInt({ min: 0 }).withMessage({ message: 'Tentativas de login deve ser um número inteiro não negativo', error: 'USR-07' }),
  check('user.password')
    .isLength({ min: 8 }).withMessage({ message: 'Senha deve ter no mínimo 8 caracteres', error: 'USR-08' })
    .matches(/[a-z]/).withMessage({ message: 'Senha deve conter ao menos 1 letra minúscula', error: 'USR-09' })
    .matches(/[A-Z]/).withMessage({ message: 'Senha deve conter ao menos 1 letra maiúscula', error: 'USR-10' })
    .matches(/[0-9]/).withMessage({ message: 'Senha deve conter ao menos 1 número', error: 'USR-14' })
    .matches(/[^A-Za-z0-9]/).withMessage({ message: 'Senha deve conter ao menos 1 caractere especial', error: 'USR-15' }),
  check('conta.transactionPassword').isLength({ min: 4 }).withMessage({ message: 'Senha de transação deve ter no mínimo 4 caracteres', error: 'USR-16' }),

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
