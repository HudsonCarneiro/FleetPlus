function loadDriverModal() {
    const modalHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cadastrar Vehicle</h5>
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
                        <input type="text" id="automaker-vehicle" class="form-control" placeholder="000.000.000-00">
                    </div>

                    <div class="mb-3">
                        <label for="phone-driver" class="form-label">Telefone</label>
                        <input type="tel" id="phone-driver" class="form-control" placeholder="(XX) XXXXX-XXXX" required>
                    </div>

                    <div class="mb-3">
                        <label for="cep-driver" class="form-label">CEP</label>
                        <input type="text" id="cep-driver" class="form-control" placeholder="87200-000">
                    </div>

                    <div class="mb-3">
                        <label for="road-driver" class="form-label">Rua</label>
                        <input type="text" id="road-driver" class="form-control" placeholder="Nome da rua" required>
                    </div>

                    <div class="mb-3">
                        <label for="complement-driver" class="form-label">Complemento</label>
                        <input type="text" id="complement-driver" class="form-control" placeholder="Complemento">
                    </div>

                    <div class="mb-3">
                        <label for="number-driver" class="form-label">Número</label>
                        <input type="text" id="number-driver" class="form-control" placeholder="Número" required>
                    </div>

                    <div class="mb-3">
                        <label for="city-driver" class="form-label">Cidade</label>
                        <input type="text" id="city-driver" class="form-control" placeholder="Cidade" required>
                    </div>

                    <div class="mb-3">
                        <label for="state-driver" class="form-label">Estado</label>
                        <input type="text" id="state-driver" class="form-control" placeholder="Estado" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
                </form>
            </div>
        </div>
    </div>
    `;

    document.getElementById('driverModalContainer').innerHTML = modalHTML;
}

loadDriverModal();
