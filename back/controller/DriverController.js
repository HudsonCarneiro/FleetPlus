import Driver from ".Model/driver.js";

document.getElementById('formDriver').addEventListener('submit', function(event){
    event.preventDefault();
    const driver = new Driver(
        document.getElementById("nome-motorista").value,
        document.getElementById("cnh-motorista").value,
        document.getElementById("telefone-motorista").value,
        document.getElementById("nascimento-motorista").value
    )
    console.log(driver);  
    registerDriver(driver);
})

function registerDriver(driver) {
    fetch('http://localhost:3000/api/driver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(driver)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('resultado').innerHTML = 'Motorista cadastrado com sucesso!';
    })
    .catch(error => {
        document.getElementById('resultado').innerHTML = 'Erro: ' + error.message;
    });
}