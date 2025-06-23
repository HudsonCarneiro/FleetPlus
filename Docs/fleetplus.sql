CREATE DATABASE IF NOT EXISTS fleetplus;
USE fleetplus;

-- Tabela: addresses
CREATE TABLE addresses (
  id INT NOT NULL AUTO_INCREMENT,
  cep VARCHAR(9) NOT NULL,
  number INT NOT NULL,
  road VARCHAR(255) NOT NULL,
  complement VARCHAR(100) DEFAULT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: users
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(55) NOT NULL,
  cpf VARCHAR(14) DEFAULT NULL,
  phone VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  salt VARCHAR(255) NOT NULL,
  addressId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY addressId (addressId),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (addressId) REFERENCES addresses (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: clients
CREATE TABLE clients (
  id INT NOT NULL AUTO_INCREMENT,
  businessName VARCHAR(255) NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  userId INT NOT NULL,
  addressId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cnpj (cnpj),
  UNIQUE KEY email (email),
  KEY userId (userId),
  KEY addressId (addressId),
  CONSTRAINT clients_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id),
  CONSTRAINT clients_ibfk_2 FOREIGN KEY (addressId) REFERENCES addresses (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: drivers
CREATE TABLE drivers (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  cnh VARCHAR(25) NOT NULL,
  phone VARCHAR(25) DEFAULT NULL,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cnh (cnh),
  KEY userId (userId),
  CONSTRAINT drivers_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: companies
CREATE TABLE companies (
  id INT NOT NULL AUTO_INCREMENT,
  companyName VARCHAR(55) NOT NULL,
  businessName VARCHAR(55) NOT NULL,
  cnpj VARCHAR(14) DEFAULT NULL,
  addressId INT NOT NULL,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY addressId (addressId),
  KEY userId (userId),
  CONSTRAINT companies_ibfk_1 FOREIGN KEY (addressId) REFERENCES addresses (id),
  CONSTRAINT companies_ibfk_2 FOREIGN KEY (userId) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: serviceproviders
CREATE TABLE serviceproviders (
  id INT NOT NULL AUTO_INCREMENT,
  businessName VARCHAR(255) NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  deletedAt DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cnpj (cnpj),
  KEY userId (userId),
  CONSTRAINT serviceproviders_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: vehicles
CREATE TABLE vehicles (
  id INT NOT NULL AUTO_INCREMENT,
  plate VARCHAR(7) NOT NULL UNIQUE,
  model VARCHAR(100) NOT NULL,
  automaker VARCHAR(100),
  year INT,
  fuelType VARCHAR(50),
  mileage INT,
  userId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: maintenances
CREATE TABLE maintenances (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  date DATETIME NOT NULL,
  nfe VARCHAR(255) DEFAULT NULL,
  type ENUM('conserto', 'lavagem', 'troca de oleo', 'outro') NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  serviceProviderId INT NOT NULL,
  vehicleId INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('aberto', 'parcelado', 'pago') NOT NULL DEFAULT 'aberto',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY userId (userId),
  KEY serviceProviderId (serviceProviderId),
  KEY vehicleId (vehicleId),
  CONSTRAINT maintenances_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id),
  CONSTRAINT maintenances_ibfk_2 FOREIGN KEY (serviceProviderId) REFERENCES serviceproviders (id),
  CONSTRAINT maintenances_ibfk_3 FOREIGN KEY (vehicleId) REFERENCES vehicles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: deliveryorders
CREATE TABLE deliveryorders (
  id INT NOT NULL AUTO_INCREMENT,
  deliveryDate DATETIME DEFAULT NULL,
  status ENUM('aguardando','enviado','finalizado') NOT NULL DEFAULT 'aguardando',
  urgency ENUM('verde','amarela','vermelha') NOT NULL DEFAULT 'verde',
  clientId INT NOT NULL,
  driverId INT NOT NULL,
  vehicleId INT NOT NULL,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY clientId (clientId),
  KEY driverId (driverId),
  KEY vehicleId (vehicleId),
  KEY userId (userId),
  CONSTRAINT deliveryorders_ibfk_1 FOREIGN KEY (clientId) REFERENCES clients (id),
  CONSTRAINT deliveryorders_ibfk_2 FOREIGN KEY (driverId) REFERENCES drivers (id),
  CONSTRAINT deliveryorders_ibfk_3 FOREIGN KEY (vehicleId) REFERENCES vehicles (id),
  CONSTRAINT deliveryorders_ibfk_4 FOREIGN KEY (userId) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela: fuelings
CREATE TABLE fuelings (
  id INT NOT NULL AUTO_INCREMENT,
  liters DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mileage DECIMAL(10,2) NOT NULL,
  dateFueling DATETIME NOT NULL,
  userId INT NOT NULL,
  driverId INT NOT NULL,
  vehicleId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY userId (userId),
  KEY driverId (driverId),
  KEY vehicleId (vehicleId),
  CONSTRAINT fuelings_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id),
  CONSTRAINT fuelings_ibfk_2 FOREIGN KEY (driverId) REFERENCES drivers (id),
  CONSTRAINT fuelings_ibfk_3 FOREIGN KEY (vehicleId) REFERENCES vehicles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
