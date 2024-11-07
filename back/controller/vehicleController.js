import Vehicle from ".Model/Vehicle.js";

document.getElementById('formVehicle').addEventListener('submit', function(event){
event.preventDefault();
const driver = new Driver(
    document.getElementById("nome-veiculo").value,
    document.getElementById("cnh-veiculo").value,
    document.getElementById("telefone-veiculo").value,
    document.getElementById("cep-veiculo").value,
    document.getElementById("nascimento-veiculo").value
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
        document.getElementById('resultado').innerHTML = 'Veículo cadastrado com sucesso!';
    })
    .catch(error => {
        document.getElementById('resultado').innerHTML = 'Erro: ' + error.message;
    });
}