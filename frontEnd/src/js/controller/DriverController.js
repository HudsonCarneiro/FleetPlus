const openModalBtn = document.getElementById("openModalBtn");

// Selecionando o modal
const modal = document.getElementById("myModal");

// Selecionando o botão de fechar (ícone de "X")
const closeBtn = document.querySelector(".close");

// Função para abrir o modal
openModalBtn.onclick = function () {
    modal.style.display = "block"; // Torna o modal visível
}

// Função para fechar o modal quando o botão de fechar for clicado
closeBtn.onclick = function () {
    modal.style.display = "none"; // Torna o modal invisível
}

// Função para fechar o modal se o usuário clicar fora do conteúdo do modal
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // Torna o modal invisível
    }
}
