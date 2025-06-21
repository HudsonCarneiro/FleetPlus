import { sanitizeNumber } from '../utils/sanitize.js';

export default class Cpf {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CPF deve ser uma string.');
    }

    const cleaned = sanitizeNumber(value);

    if (!Cpf.validate(cleaned)) {
      throw new Error('CPF inválido.');
    }

    this.value = cleaned;
  }

  static validate(value) {
    const cleaned = sanitizeNumber(value);

    // Validação simplificada: apenas verifica se tem 11 dígitos numéricos
    return /^\d{11}$/.test(cleaned);
  }

  toString() {
    return this.value;
  }
}
