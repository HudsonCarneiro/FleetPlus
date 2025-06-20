export default class Cpf {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CPF deve ser uma string.');
    }

    const cleaned = Cpf._sanitize(value);

    if (!Cpf.validate(cleaned)) {
      throw new Error('CPF inválido.');
    }

    this.value = cleaned;
  }

  static _sanitize(value) {
    return value.replace(/[^\d]/g, '').trim();
  }

  static validate(value) {
    const cleaned = this._sanitize(value);

    // Validação simplificada: apenas verifica se tem 11 dígitos numéricos
    return /^\d{11}$/.test(cleaned);
  }

  toString() {
    return this.value;
  }
}
