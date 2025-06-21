import Cnh from '../validators/cnh.js';
import Phone from '../validators/phone.js';

export default class Driver {
  constructor(name, cnh, phone) {
    if (!name || typeof name !== 'string') {
      throw new Error('Nome do motorista inválido.');
    }

    this.name = name;
    this.cnh = new Cnh(cnh).toString();
    this.phone = new Phone(phone).toString();
  }
}
