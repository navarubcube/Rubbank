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

  export const validateInput = [
    check('input').custom((value) => {
      // Verificar se é um email
      const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      // Verificar se é um número de conta (7 dígitos)
      const isAccountNumber = /^\d{7}$/.test(value);
      // Verificar se é um CPF (11 dígitos)
      const isCPF = /^\d{11}$/.test(value) && validateCPF(value);
      // Verificar se é um número de telefone
      const isPhoneNumber = /^\d{10,11}$/.test(value);
      
      if (!isEmail && !isAccountNumber && !isCPF && !isPhoneNumber) {
        throw new Error('Entrada inválida');
      }
  
      if (isCPF && !validateCPF(value)) {
        throw new Error('CPF inválido');
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
  
