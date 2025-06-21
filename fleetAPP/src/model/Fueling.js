import Vehicle from './Vehicle.js';
import Driver from './Driver.js';
import Price from '../validators/Price.js';

export default class Fueling {
  constructor(liters, price, mileage, date, vehicle, driver) {
    if (!liters || liters <= 0) throw new Error('Litros inválido.');
    if (!mileage || mileage <= 0) throw new Error('Quilometragem inválida.');
    if (!date) throw new Error('Data obrigatória.');

    this.liters = liters;
    this.price = new Price(price).value;
    this.mileage = mileage;
    this.dateFueling = date;
    this.vehicle = new Vehicle(vehicle);
    this.driver = new Driver(driver);
  }
}