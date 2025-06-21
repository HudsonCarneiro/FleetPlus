export default class Price {
  constructor(value) {
    if (!Price.validate(value)) {
      throw new Error('Valor de preço inválido');
    }

    this.value = parseFloat(value);
  }

  static validate(value) {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
  }

  toNumber() {
    return this.value;
  }

  toString() {
    return this.value.toFixed(2); // Opcional: para exibição formatada com duas casas
  }
}
