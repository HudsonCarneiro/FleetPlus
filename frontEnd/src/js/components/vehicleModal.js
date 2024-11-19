function loadVehicleModal() {
    const modalHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cadastrar Veículo</h5>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="formVehicle" class="mt-4">
                    <div class="mb-3">
                        <label for="model-vehicle" class="form-label">Modelo</label>
                        <input type="text" id="model-vehicle" class="form-control" placeholder="Modelo do Veiculo" required>
                    </div>

                    <div class="mb-3">
                        <label for="automaker-vehicle" class="form-label">Montadora</label>
                        <input type="text" id="automaker-vehicle" class="form-control" placeholder="000.000.000-00" required>
                    </div>

                    <div class="mb-3">
                        <label for="year-vehicle" class="form-label">Ano</label>
                        <input type="number" id="year-vehicle" class="form-control"  min="1900" max="2100" placeholder="Ano" required>
                    </div>

                    <div class="mb-3">
                        <label for="fuelType-vehicle" class="form-label">Tipo de Combustível</label>
                        <select id="fuelType-vehicle" class="form-select" required>
                            <option value="" disabled selected>Selecione o tipo de combustível</option>
                            <option value="gasolina">Gasolina</option>
                            <option value="etanol">Etanol</option>
                            <option value="diesel">Diesel</option>
                        </select>
                    </div>


                    <div class="mb-3">
                        <label for="mileage-vehicle" class="form-label">Quilometragem</label>
                        <input type="number" id="quilometragem-vehicle" class="form-control" placeholder="000000" min="0" max="999999" step="1" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Enviar</button>
                </form>
            </div>
        </div>
    </div>
    `
    ;

    document.getElementById('vehicleModalContainer').innerHTML = modalHTML;
}

loadDriverModal();
