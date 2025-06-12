Fleet Plus - Sistema de Gerenciamento de Frotas de Veículos 
Bem-vindo ao repositório do Sistema de Gerenciamento de Frotas de Veículos. 
Este sistema tem como objetivo gerenciar as ordens de entrega, motoristas, veículos e 
o abastecimento de frotas, facilitando a operação logística de uma distribuidora de autopeças.

Tecnologias Utilizadas
Node.js: Plataforma de backend utilizada para criar a API do sistema.
Express.js: Framework utilizado para roteamento e criação de endpoints.
Sequelize: ORM para comunicação com o banco de dados relacional.
MySQL: Banco de dados relacional utilizado para armazenamento de dados.
Cors: Middleware para habilitar comunicação entre diferentes origens.
Body-Parser: Middleware para lidar com dados enviados nas requisições.

Funcionalidades Principais:
Gerenciamento de Motoristas: CRUD para adicionar, editar, visualizar e remover motoristas.
Gerenciamento de Veículos: CRUD para cadastrar e gerenciar veículos da frota.
Gerenciamento de Abastecimentos: Controle de consumo de combustível, incluindo o registro de litros, preços e quilometragem.
Gerenciamento de Clientes: Registro e manutenção de dados dos clientes que recebem as entregas.
Ordens de Entrega: Controle das ordens de entrega, associando motoristas, veículos e clientes.
Endereços: Cadastro de endereços para usuários, motoristas e clientes.
Usuários: Controle de acesso e gerenciamento de perfis de usuários do sistema.

## 📦 Tecnologias

- Node.js
- Express
- Sequelize
- MySQL
- Docker & Docker Compose
- React

## 🚀 Como executar

1. Clone o repositório:
```bash
git clone https://github.com/HudsonCarneiro/fleetplus.git
cd fleetplus
docker-compose up