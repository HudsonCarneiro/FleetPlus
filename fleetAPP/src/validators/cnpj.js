export default class Cnpj {
  constructor(value) {
    this.value = Cnpj.validate(value);
  }

  static validate(value) {
    if (typeof value !== 'string') {
      throw new Error('CNPJ deve ser uma string.');
    }

    const cleaned = value.replace(/[^\d]/g, '').trim();

    if (!/^\d{14}$/.test(cleaned)) {
      throw new Error('CNPJ deve conter exatamente 14 números.');
    }

    return cleaned;
  }

  toString() {
    return this.value;
  }
}
