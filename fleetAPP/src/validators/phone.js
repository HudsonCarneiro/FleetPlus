export default class Phone {
  constructor(number) {
    const cleaned = this._sanitize(number);

    if (!this._isValid(cleaned)) {
      throw new Error('Número de telefone inválido');
    }

    this.value = cleaned;
  }

  _sanitize(number) {
    return number.replace(/\D/g, '');
  }

  _isValid(cleanedNumber) {
    return /^\d{10,11}$/.test(cleanedNumber);
  }

  toString() {
    return this.value;
  }
}
