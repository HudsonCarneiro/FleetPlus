import Address from './Address';
export default class Driver{
    constructor(name, cnh, phone, birthDate, address){
        this.name = name;
        this.cnh = cnh;
        this.phone = phone;
        this.birthDate = birthDate;
        this.address = address;
    }
    getDriver(){ 
        return `Nome: ${this.name}\nCNH: ${this.cpf}\nTelefone: ${this.phone}\nbirthDate: ${this.email}\nEndereço: ${this.address.getAddress()}`;
    }
}
