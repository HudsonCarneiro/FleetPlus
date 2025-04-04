document.addEventListener('DOMContentLoaded', () => {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-light custom-bg fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="../pages/index.html">FleetPlus</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Sobre</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./formLogin.html" style="margin-right: 30px;">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
  document.getElementById('navbar-static').innerHTML = navbarHTML;
});
