import { sanitizeNumber } from '../utils/sanitize.js';

export default class Phone {
  constructor(value) {
    const cleaned = sanitizeNumber(value);

    if (!Phone.validate(cleaned)) {
      throw new Error('Número de telefone inválido');
    }

    this.value = cleaned;
  }

  static validate(value) {
    const cleaned = sanitizeNumber(value);
    return /^\d{10,11}$/.test(cleaned);
  }

  toString() {
    return this.value;
  }
}
