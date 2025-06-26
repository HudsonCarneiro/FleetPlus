const DeliveryOrder = require('../models/DeliveryOrder');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const { getClientAll } = require('./clientController');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

exports.exportDeliveriesReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const deliveries = await DeliveryOrder.findAll({ where: { userId } });
    if (!deliveries.length) {
      return res.status(404).json({ error: 'Nenhuma ordem de entrega encontrada.' });
    }

    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll({ query: { userId } }, { status: () => ({ json: resolve, send: reject }) });
    });
    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll({ query: { userId } }, { status: () => ({ json: resolve, send: reject }) });
    });
    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    const clientsResponse = await new Promise((resolve, reject) => {
      getClientAll({ query: { userId } }, { status: () => ({ json: resolve, send: reject }) });
    });
    const clients = Array.isArray(clientsResponse) ? clientsResponse : [];

    const deliveriesWithDetails = deliveries.map((delivery) => {
      const driver = drivers.find((d) => d.id === delivery.driverId);
      const vehicle = vehicles.find((v) => v.id === delivery.vehicleId);
      const client = clients.find((c) => Number(c.id) === Number(delivery.clientId));

      const formattedAddress = client?.address
        ? `${client.address.road || ''}, ${client.address.number || ''}, ${client.address.city || ''} - ${client.address.state || ''}, ${client.address.cep || ''}`
        : 'Endereço não disponível';

      return {
        ...delivery.toJSON(),
        Driver: driver?.name || 'Desconhecido',
        Vehicle: vehicle ? `${vehicle.model} (${vehicle.plate})` : 'Desconhecido',
        Client: client?.businessName || 'Desconhecido',
        Address: formattedAddress,
      };
    });

    const reportDate = new Date().toLocaleDateString();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          p.date { text-align: right; font-size: 12px; color: #666; }
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
        <p class="date">Emitido em: ${reportDate}</p>
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
                  <td>${delivery.Driver}</td>
                  <td>${delivery.Vehicle}</td>
                  <td>${delivery.Client}</td>
                  <td>${delivery.Address}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const filePath = path.join(__dirname, `../../downloads/delivery-report-${userId}.pdf`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.pdf({ path: filePath, format: 'A4', landscape: true });
    await browser.close();

    res.download(filePath, `relatorio-ordensDeEntrega-${userId}.pdf`, () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de entregas:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de entregas.',
      details: error.message,
    });
  }
};
