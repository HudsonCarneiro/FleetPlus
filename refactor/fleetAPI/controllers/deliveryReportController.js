const DeliveryOrder = require('../models/DeliveryOrder');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const { getClientAll } = require('./clientController');
const htmlPdf = require('html-pdf');
const path = require('path');

exports.exportDeliveriesReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas as ordens de entrega
    const deliveries = await DeliveryOrder.findAll({ where: { userId } });

    if (!deliveries.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    // Busca os motoristas
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca os veículos
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Busca os clientes
    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });
    
    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];

    // Associa os dados aos pedidos
    const deliveriesWithDetails = deliveries.map((delivery) => {
      const driver = drivers.find((d) => d.id === delivery.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === delivery.vehicleId) || null;
      const client =
      clients.find((c) => Number(c.id) === Number(delivery.clientId)) || {
        businessName: 'Cliente não encontrado',
      };

      return {
        ...delivery.toJSON(),
        Driver: driver ? { id: driver.id, name: driver.name } : null,
        Vehicle: vehicle
          ? {
              id: vehicle.id,
              model: vehicle.model,
              licensePlate: vehicle.plate,
            }
          : null,
  
        Client: client
          ? {
              id: client.id,
              businessName: client.businessName || 'Desconhecido',
              address: client.address
                ? `${client.address.road || ''}, ${client.address.number || ''}, ${client.address.city || ''} - ${client.address.state || ''}, ${client.address.cep || ''}`
                : 'Endereço não disponível',
            }
          : null,
      };
    });

    // Gera o HTML para o relatório
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          tr:nth-child(even) { background-color: #f9f9f9; }
          td { word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>Relatório de Ordens de Entrega</h1>
        <table>
          <thead>
            <tr>
              <th>COD</th>
              <th>Data de Entrega</th>
              <th>Status</th>
              <th>Urgência</th>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Cliente</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            ${deliveriesWithDetails
              .map((delivery) => `
                <tr>
                  <td>${delivery.id}</td>
                  <td>${delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : 'Não definida'}</td>
                  <td>${delivery.status}</td>
                  <td>${delivery.urgency}</td>
                  <td>${delivery.Driver?.name || 'Desconhecido'}</td>
                  <td>${delivery.Vehicle ? `${delivery.Vehicle.model} (${delivery.Vehicle.licensePlate})` : 'Desconhecido'}</td>
                  <td>${delivery.Client ?.businessName || 'Desconhecido'}</td>
                  <td>${delivery.Client ?.address || 'Endereço não disponível'}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Caminho para salvar o PDF
    const filePath = path.join(__dirname, `../../downloads/delivery-report-${userId}.pdf`);

    // Opções de configuração do PDF
    const options = {
      format: 'A4',
      orientation: 'landscape', // Paisagem
      border: '10mm',
    };

    // Gera o PDF
    htmlPdf.create(html, options).toFile(filePath, (err, result) => {
      if (err) {
        console.error('Erro ao gerar o PDF:', err.message);
        return res.status(500).json({ error: 'Erro ao gerar o PDF.' });
      }

      // Envia o PDF como download
      res.download(result.filename, `relatorio-ordensDeEntrega-${userId}.pdf`, () => {
        console.log('Relatório gerado e enviado:', result.filename);
      });
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de entregas:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de entregas.',
      details: error.message,
    });
  }
};
