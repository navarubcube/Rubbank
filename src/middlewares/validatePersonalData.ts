import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

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
  
    export const validatePersonalData = [
        
    // Validações específicas para atualização de dados pessoais
    check('user.nome_completo').isLength({ min: 4 }).withMessage({message: 'Nome completo é obrigatório', error: 'USR-01'}),
    check('user.email').isEmail().withMessage({ message: 'Email inválido', error: 'USR-02' }),
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
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    
    ];
