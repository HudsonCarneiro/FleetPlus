class CNPJ {
    constructor(value) {
      const cleaned = value.replace(/\D/g, '');
  
      if (!CNPJ.isValid(cleaned)) {
        throw new Error('CNPJ inválido');
      }
  
      this.value = cleaned;
    }
  
    static isValid(cnpj) {
      if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
      const calcCheckDigit = (base, weights) => {
        const sum = base
          .split('')
          .reduce((acc, num, i) => acc + parseInt(num) * weights[i], 0);
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
  