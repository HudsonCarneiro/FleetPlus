class CPF {
  constructor(value) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('CPF deve ser uma string ou número.');
    }

    // Remove tudo que não for número
    const cleaned = value.toString().replace(/[^\d]/g, '').trim();

    //verifica se tem 11 dígitos
    if (!/^\d{11}$/.test(cleaned)) {
      throw new Error('CPF deve conter exatamente 11 números.');
    }

    this.value = cleaned;
  }

  toString() {
    return this.value;
  }
}

module.exports = CPF;