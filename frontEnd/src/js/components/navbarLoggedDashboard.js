document.addEventListener('DOMContentLoaded', () => {
  const navbarHTML = `
    <nav id="navbar-example3" class="navbar navbar-light bg-light flex-column align-items-stretch p-3">
        <a class="navbar-brand" href="#">Menu</a>
        <nav class="nav nav-pills flex-column">
            <h6 class="text-muted">Motoristas</h6>
            <a class="nav-link" href="#item-1">Ver Motoristas</a>
            <nav class="nav nav-pills flex-column">
            <a class="nav-link"  href="#item-1-1">Cadastrar Motorista</a>
            
            <h6 class="text-muted">Veículos</h6>
            <a class="nav-link" href="#item-1-2">Ver Veículos</a>
            </nav>
            <a class="nav-link" href="#item-2">Cadastrar Veículo</a>

            <h6 class="text-muted">Clientes</h6>
            <a class="nav-link" href="#item-3">Ver Clientes</a>
            <nav class="nav nav-pills flex-column">
            <a class="nav-link" href="#item-3-1">Cadastrar Cliente</a>

            <h6 class="text-muted">Abastecimentos</h6>
            <a class="nav-link" href="#item-3">Ver Abastecimentos</a>
            <nav class="nav nav-pills flex-column">
            <a class="nav-link" href="#item-3-1">Registrar Abastecimento</a>
            
            </nav>
        </nav>
    </nav>
  `;
  document.getElementById('navbarLoggedDashboard-static').innerHTML = navbarHTML;
});
