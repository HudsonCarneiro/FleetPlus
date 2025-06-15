class CNPJ {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CNPJ deve ser uma string.');
    }

    // Remove tudo que não for número
    const cleaned = value.replace(/[^\d]/g, '').trim();

    // Validação simplificada: só verifica se tem 14 dígitos
    if (!/^\d{14}$/.test(cleaned)) {
      throw new Error('CNPJ deve conter exatamente 14 números.');
    }

    this.value = cleaned;
  }

  toString() {
    return this.value;
  }
}

module.exports = CNPJ;
