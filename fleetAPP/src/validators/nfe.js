import { sanitizeNumber } from '../utils/sanitize.js';

export default class NFe {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('Nota Fiscal deve ser uma string.');
    }

    const cleaned = sanitizeNumber(value);

    if (!NFe.validate(cleaned)) {
      throw new Error('Chave de acesso da Nota Fiscal inválida.');
    }

    this.value = cleaned;
  }

  static validate(value) {
    const cleaned = sanitizeNumber(value);
    return /^\d{44}$/.test(cleaned); // Chave de acesso da NF-e = 44 dígitos
  }

  toString() {
    return this.value;
  }
}
