class CPF {
    constructor(value) {
      const cleaned = value.replace(/\D/g, '');
  
      if (!CPF.isValid(cleaned)) {
        throw new Error('CPF inválido');
      }
  
      this.value = cleaned;
    }
  
    static isValid(cpf) {
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
      const calcCheckDigit = (base, weight) =>
        ((base
          .split('')
          .reduce((acc, num, i) => acc + parseInt(num) * (weight - i), 0) * 10) %
          11) %
        10;
  
      const base = cpf.slice(0, 9);
      const digit1 = calcCheckDigit(base, 10);
      const digit2 = calcCheckDigit(base + digit1, 11);
  
      return cpf === base + digit1 + digit2;
    }
  
    toString() {
      return this.value;
    }
  }
  
  module.exports = CPF;
  