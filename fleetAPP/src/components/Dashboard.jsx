import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <br />
      <h5 class="text-muted title-font">Meu Perfil</h5>
      <Link to="#" className='link-font'>Ver Perfil</Link>
      <Link to="#" className='link-font'>Editar Perfil</Link>
  
      <div className='separator'></div>

      <div className='sectionContainer'>
        <h5 class="text-muted title-font">Ordem de Entrega</h5>
        <Link to="#" className='link-font'>Ver Entregas</Link>
        <Link to="#" className='link-font'>Criar Ordem</Link>
      </div>

      <div className='separator'></div>

      <h5 class="text-muted title-font">Abastecimentos</h5>
      <Link to="#" className='link-font'>Ver Abastecimentos</Link>
      <Link to="#" className='link-font'>Registrar Abastecimento</Link>

      <div className='separator'></div>
    
      <h5 class="text-muted title-font">Motoristas</h5>
      <Link to="#" className='link-font'>Ver Motoristas</Link>
      <Link to="#" className='link-font'>Cadastrar Motorista</Link>
      
      <div className='separator'></div>

      <h5 class="text-muted title-font">Clientes</h5>
      <Link to="#" className='link-font'>Ver Clientes</Link>
      <Link to="#" className='link-font'>Cadastrar Cliente</Link>
     
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".link-font");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove a classe "active" de todos os botões
      buttons.forEach((btn) => btn.classList.remove("active"));
      
      // Adiciona a classe "active" apenas ao botão clicado
      button.classList.add("active");
    });
  });
});


const Content = () => {
  return (
    <div className="content">
      {/* Aqui virão as funcionalidades do dashboard */}
      <h1>Bem-vindo ao FleetPlus</h1>
      <p>Selecione uma opção no menu para ver os detalhes.</p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <section className="main">
        <Sidebar />
        <Content />
      </section>
    </>
  );
};

export default Dashboard;

