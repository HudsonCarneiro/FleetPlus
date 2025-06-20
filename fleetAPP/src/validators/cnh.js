export default class Cnh {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CNH deve ser uma string.');
    }

    const cleaned = Cnh._sanitize(value);

    if (!Cnh.validate(cleaned)) {
      throw new Error('CNH inválida.');
    }

    this.value = cleaned;
  }

  static _sanitize(value) {
    return value.replace(/[^\d]/g, '').trim();
  }

  static validate(value) {
    const cleaned = this._sanitize(value);
    return /^\d{11}$/.test(cleaned); // CNH deve ter 11 dígitos
  }

  toString() {
    return this.value;
  }
}
