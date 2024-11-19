document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', function () {
        const panelDescription = document.getElementById('panel-description');
        const panelContent = document.querySelector('#control-panel .panel-content');
        
        // Mudar a descrição do painel com base no botão
        if (this.id === "open-driverModal") {
            panelDescription.textContent = 'Aqui estão os motoristas';
            panelContent.textContent = 'Conteúdo de motoristas';
        } else if (this.id === "open-vehicleModal") {
            panelDescription.textContent = 'Aqui estão os veículos';
            panelContent.textContent = 'Conteúdo de veículos';
        } else if (this.id === "open-Modal") {
            panelDescription.textContent = 'Aqui estão os clientes';
            panelContent.textContent = 'Conteúdo de clientes';
        } else {
            panelDescription.textContent = 'Selecione uma opção no menu lateral';
            panelContent.textContent = 'Conteúdo padrão';
        }

        // Adiciona a classe visível ao painel de conteúdo
        panelContent.classList.add('visible');
    });
});
