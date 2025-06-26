export default class Password {
  constructor(value) {
    this.value = Password.validate(value);
  }

  static validate(value) {
    if (typeof value !== 'string') {
      throw new Error('A senha deve ser uma string.');
    }

    const trimmed = value.trim();

    const hasMinLength = trimmed.length >= 8;
    const hasUppercase = /[A-Z]/.test(trimmed);
    const hasNumber = /\d/.test(trimmed);

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      throw new Error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.');
    }

    return trimmed;
  }

  toString() {
    return this.value;
  }
}
