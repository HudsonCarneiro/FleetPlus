class Email {
  constructor(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      throw new Error('Email inválido');
    }
    this.value = value;
  }
}
  
module.exports = Email;
  