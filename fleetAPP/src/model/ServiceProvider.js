import Cnpj from '../validators/Cnpj';
import Phone from '../validators/Phone';

export default class ServiceProvider {
  constructor(businessName, companyName, cnpj, phone) {
    if (!businessName || !companyName || !cnpj || !phone) {
      throw new Error('Todos os campos são obrigatórios para o prestador de serviço.');
    }

    this.businessName = businessName;
    this.companyName = companyName;
    this.cnpj = new Cnpj(cnpj).toString();
    this.phone = new Phone(phone).toString();
  }
}
