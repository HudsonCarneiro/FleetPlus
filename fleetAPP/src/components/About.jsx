import React from "react";
import "../styles/About.css";

export const About = () => {
  return (
    <div className="background-about">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold text-primary title-about">FleetPlus</h1>
          <p className="lead text-muted">
            Bem-vindo ao FleetPlus, o sistema completo para <strong>gerenciamento de frotas de veículos</strong>. 
            Desenvolvido para facilitar a logística e operação de distribuidoras, o FleetPlus é sua solução ideal para 
            gerenciar motoristas, veículos, abastecimentos e ordens de entrega com eficiência e inteligência.
          </p>
        </div>
        <div className="col-lg-6">
          <img 
            src="/src/assets/about.jpg" 
            alt="FleetPlus system illustration" 
            className="img-fluid rounded shadow"
            style={{ width: '46%' }}
          />
            <img 
            src="/src/assets/about02.jpg" 
            alt="FleetPlus system illustration" 
            className="img-fluid rounded shadow"
            style={{ width: '46%' }}
          />
        </div>
      </div>

      <hr className="my-5" />

      <div className="row">
        <div className="col-lg-12 text-center">
          <h2 className="fw-bold text-secondary">Tecnologias de Ponta</h2>
          <p className="text-muted">
            O FleetPlus foi construído com as melhores ferramentas do mercado, garantindo 
            <strong>desempenho</strong>, <strong>segurança</strong> e <strong>escalabilidade</strong>:
          </p>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4">
          <i className="bi bi-box-seam fs-1 text-primary"></i>
          <h5 className="mt-3">Node.js & Express.js</h5>
          <p className="text-muted">Back-end robusto e flexível para APIs dinâmicas e rápidas.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-database fs-1 text-primary"></i>
          <h5 className="mt-3">Sequelize & MySQL</h5>
          <p className="text-muted">Armazenamento de dados confiável com comunicação simplificada.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-shield-lock fs-1 text-primary"></i>
          <h5 className="mt-3">Segurança</h5>
          <p className="text-muted">Middleware como Cors e Body-Parser para um ambiente seguro.</p>
        </div>
      </div>
      <hr className="my-5" />

      <div className="row">
        <div className="col-lg-12 text-center">
          <h2 className="fw-bold text-secondary">Funcionalidades que Transformam</h2>
          <p className="text-muted">
            Explore todas as funcionalidades do FleetPlus e revolucione a gestão de sua frota:
          </p>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4">
          <i className="bi bi-people fs-1 text-primary"></i>
          <h5 className="mt-3">Motoristas</h5>
          <p className="text-muted">Adicione, edite e acompanhe os motoristas da frota.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-truck fs-1 text-primary"></i>
          <h5 className="mt-3">Veículos</h5>
          <p className="text-muted">Gerencie a frota de forma prática e eficiente.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-fuel-pump fs-1 text-primary"></i>
          <h5 className="mt-3">Abastecimentos</h5>
          <p className="text-muted">
            Controle o consumo de combustível, preços e quilometragem.
          </p>
        </div>
      </div>
      <div className="row text-center mt-4">
        <div className="col-md-4">
          <i className="bi bi-person-check fs-1 text-primary"></i>
          <h5 className="mt-3">Clientes</h5>
          <p className="text-muted">Gerencie os clientes com informações completas e organizadas.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-bag-check fs-1 text-primary"></i>
          <h5 className="mt-3">Ordens de Entrega</h5>
          <p className="text-muted">Controle de entregas com associação de motoristas e veículos.</p>
        </div>
        <div className="col-md-4">
          <i className="bi bi-geo-alt fs-1 text-primary"></i>
          <h5 className="mt-3">Endereços</h5>
          <p className="text-muted">Cadastro detalhado para usuários, clientes e entregas.</p>
        </div>
      </div>
    </div>
  );
};
