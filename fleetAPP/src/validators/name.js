export default class Name {
    constructor(value) {
      if (typeof value !== 'string') {
        throw new Error('Nome deve ser uma string.');
      }
  
      const cleaned = Name.clean(value);
  
      if (!Name.validate(cleaned)) {
        throw new Error('Nome inválido. Deve ter pelo menos 2 letras e não conter números ou caracteres especiais.');
      }
  
      this.value = cleaned;
    }
  
    static clean(value) {
      return value.trim().replace(/\s+/g, ' ');
    }
  
    static validate(value) {
      if (value.length < 2) return false;
      
      return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
    }
  
    toString() {
      return this.value;
    }
  }
  