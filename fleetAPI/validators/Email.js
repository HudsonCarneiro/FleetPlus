class Email {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('Email deve ser uma string.');
    }

    const cleaned = value.trim();

    // Validação simplificada: verifica se tem "@" e "."
    if (!cleaned.includes('@') || !cleaned.includes('.')) {
      throw new Error('Email deve conter "@" e ".".');
    }

    this.value = cleaned;
  }

  toString() {
    return this.value;
  }
}

module.exports = Email;