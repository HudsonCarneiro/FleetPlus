export default class Email {
  constructor(value) {
    this.value = Email.validate(value);
  }

  static validate(value) {
    if (typeof value !== 'string') {
      throw new Error('Email deve ser uma string.');
    }

    const cleaned = value.trim().toLowerCase();

    // Validação simples usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned)) {
      throw new Error('Email inválido.');
    }

    return cleaned;
  }

  toString() {
    return this.value;
  }
}
