import Car from ".Model/Car.js";

document.getElementById('formDriver').addEventListener('submit', function(event){
event.preventDefault();
const driver = new Driver(
    document.getElementById("nome-motorista").value,
    document.getElementById("cnh-motorista").value,
    document.getElementById("telefone-motorista").value,
    document.getElementById("cep-motorista").value,
    document.getElementById("nascimento-motorista").value
)
    registerDriver(driver);
})

function registerDriver(driver) {
    fetch('https://localhost.com/drivers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('resultado').innerHTML = 'Usuário cadastrado com sucesso!';
    })
    .catch(error => {
        document.getElementById('resultado').innerHTML = 'Erro: ' + error.message;
    });
}