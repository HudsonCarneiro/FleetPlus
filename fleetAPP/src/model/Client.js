import Cnpj from '../validators/Cnpj.js';
import Phone from  '../validators/Phone.js';
import Email from '../validators/Email.js';

export default class Client{
    constructor(businessName, companyName, cnpj, phone, email){
        if (!businessName || !companyName || !cnpj || !phone || !email) {
            throw new Error('Todos os campos são obrigatórios');
        }

        this.businessName = businessName;
        this.companyName = companyName;
        this.cnpj = new Cnpj(cnpj).toString();
        this.phone = new Phone(phone).toString();
        this.email = new Email(email).toString();
    }
}