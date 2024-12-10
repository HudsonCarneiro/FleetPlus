const Client = require('../models/Client');
const Address = require('../models/Address') // Certifique-se de importar ambos os modelos
const addressController = require('./addressController')


exports.getClientAll = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca os clientes vinculados ao usuário
    const clients = await Client.findAll({
      where: { userId },
    });

    if (clients.length === 0) {
      return res.status(404).json({ error: 'Nenhum cliente encontrado.' });
    }

    // Para cada cliente, buscamos o endereço através do addressController
    for (const client of clients) {
      const addressResponse = await addressController.getAddressbyId({ params: { id: client.addressId } }, res);
      client.dataValues.address = addressResponse; // Atribui o endereço retornado à propriedade address do cliente
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar clientes',
      details: error.message,
    });
  }
};


export const fetchClientById = async (id) => {
  try {
    const userId = getUserIdFromSession(); // Obtemos o ID do usuário autenticado
    if (!userId) throw new Error("Usuário não autenticado.");

    console.log("Buscando cliente com ID:", id);

    // Faz a chamada para o endpoint do backend
    const response = await fetch(`${API_URL}/client/${id}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
    }

    // Obtém os dados do cliente retornados pela API
    const clientData = await response.json();

    // Certifica-se de que os dados do endereço estão presentes
    const formattedData = {
      id: clientData.id || "",
      businessName: clientData.businessName || "",
      companyName: clientData.companyName || "",
      cnpj: clientData.cnpj || "",
      phone: clientData.phone || "Não informado",
      email: clientData.email || "",
      address: {
        id: clientData.addressId || "",
        cep: clientData.cep || "CEP não informado",
        road: clientData.road || "Logradouro não informado",
        number: clientData.number || "Número não informado",
        complement: clientData.complement || "",
        city: clientData.city || "Cidade não informada",
        state: clientData.state || "Estado não informado",
      },
    };

    return formattedData;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message);
    throw error;
  }
};

// Cria um cliente e o endereço vinculado ao usuário autenticado
exports.createClient = async (req, res) => {
  try {
    const { userId, address, ...clientData } = req.body; // Desestrutura endereço e dados do cliente
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Criar o endereço
    const createdAddress = await Address.create({
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    });

    // Criar o cliente com referência ao endereço
    const newClient = await Client.create({
      ...clientData,
      addressId: createdAddress.id,
      userId,
    });

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar um cliente',
      details: error.message,
    });
  }
};

// Atualiza um cliente e o endereço vinculado
// controller/ClientController.js
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      addressId,
      cep,
      road,
      number,
      complement,
      city,
      state,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do cliente não fornecido." });
    }

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Atualizar os dados do cliente
    await client.update({
      businessName,
      companyName,
      cnpj,
      phone,
      email,
    });

    // Atualizar ou criar os dados do endereço
    if (addressId) {
      const address = await Address.findByPk(addressId);

      if (address) {
        await address.update({
          cep,
          road,
          number,
          complement,
          city,
          state,
        });
      } else {
        console.warn("Endereço não encontrado. Criando novo...");
        await Address.create({
          clientId: client.id,
          cep,
          road,
          number,
          complement,
          city,
          state,
        });
      }
    } else {
      // Caso não exista um endereço associado, cria um novo
      await Address.create({
        clientId: client.id,
        cep,
        road,
        number,
        complement,
        city,
        state,
      });
    }

    res.status(200).json({ message: "Cliente atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({
      error: "Erro ao atualizar cliente.",
      details: error.message,
    });
  }
};

// Exclui um cliente e o endereço vinculado
exports.deleteClient = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const client = await Client.findOne({
      where: { id: req.params.id, userId },
    });

    if (client) {
      // Excluir o cliente
      await Client.destroy({
        where: { id: req.params.id, userId },
      });

      // Opcional: Excluir o endereço associado
      await Address.destroy({
        where: { id: client.addressId },
      });

      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cliente não encontrado ou não autorizado.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar cliente',
      details: error.message,
    });
  }
};
