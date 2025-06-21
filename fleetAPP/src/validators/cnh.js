import { sanitizeNumber } from '../utils/sanitize.js';

export default class Cnh {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CNH deve ser uma string.');
    }

    const cleaned = sanitizeNumber(value);

    if (!Cnh.validate(cleaned)) {
      throw new Error('CNH inválida.');
    }

    this.value = cleaned;
  }

  static validate(value) {
    const cleaned = sanitizeNumber(value);
    return /^\d{11}$/.test(cleaned); // CNH deve ter 11 dígitos
  }

  toString() {
    return this.value;
  }
}
