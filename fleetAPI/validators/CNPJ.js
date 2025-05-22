class CNPJ {
  constructor(value) {
    if (typeof value !== 'string') {
      throw new Error('CNPJ deve ser uma string.');
    }

    // Remove tudo que não for número
    const cleaned = value.replace(/[^\d]/g, '').trim();

    if (!CNPJ.isValid(cleaned)) {
      throw new Error('CNPJ inválido');
    }

    this.value = cleaned;
  }

  static isValid(cnpj) {
    if (!/^\d{14}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const calcCheckDigit = (base, weights) => {
      const sum = base
        .split('')
        .reduce((acc, num, i) => acc + parseInt(num, 10) * weights[i], 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const base = cnpj.slice(0, 12);
    const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const digit2 = calcCheckDigit(base + digit1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return cnpj === base + digit1 + digit2;
  }

  toString() {
    return this.value;
  }
}

module.exports = CNPJ;
