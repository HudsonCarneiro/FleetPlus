export default class Address{
    constructor(cep, road, number, complement = '', city, state){
        this.cep = cep;
        this.road = road;
        this.number = number;
        this.city = city;
        this.state = state;
        this.complement = complement;
    }
}