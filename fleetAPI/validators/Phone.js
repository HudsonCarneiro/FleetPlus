class Phone {
    constructor(number) {
      const cleaned = number.replace(/\D/g, '');
  
      if (!/^\d{10,11}$/.test(cleaned)) {
        throw new Error('Número de telefone inválido');
      }
  
      this.value = cleaned;
    }
  
    toString() {
      return this.value;
    }
  }
  
  module.exports = Phone;
  