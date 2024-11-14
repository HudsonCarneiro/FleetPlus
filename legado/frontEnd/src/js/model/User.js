export default class User{
    constructor(name, cpf, phone, address, email, password){
        this.name = name;
        this.cpf = cpf;
        this.phone = phone;
        this.address = address; 
        this.email = email;
        this.password = password;
    }
    getUser(){ 
        return `Nome: ${this.name}\nCPF: ${this.cpf}\nTelefone: ${this.phone}\nEmail: ${this.email}\nEndereço: ${this.address.getAddress()}`;
    }
}