const DeliveryOrder = require('../models/DeliveryOrder');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');

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

    // Busca todos os motoristas do usuário
    const driversResponse = await new Promise((resolve, reject) => {
      getDriverAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });

    const drivers = Array.isArray(driversResponse) ? driversResponse : [];

    // Busca todos os veículos do usuário
    const vehiclesResponse = await new Promise((resolve, reject) => {
      getVehicleAll(
        { query: { userId } },
        { status: (statusCode) => ({ json: resolve, send: reject }) }
      );
    });

    const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];

    // Associa os dados de motorista e veículo às ordens de entrega
    const deliveriesWithDetails = deliveries.map((delivery) => {
      const driver = drivers.find((d) => d.id === delivery.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === delivery.vehicleId) || null;

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
            text-align: center;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Relatório de Ordens de Entrega</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data de Entrega</th>
              <th>Status</th>
              <th>Urgência</th>
              <th>Motorista</th>
              <th>Veículo</th>
            </tr>
          </thead>
          <tbody>
            ${deliveriesWithDetails
              .map((delivery) => `
                <tr>
                  <td>${delivery.id}</td>
                  <td>${new Date(delivery.deliveryDate).toLocaleDateString() || 'Não definida'}</td>
                  <td>${delivery.status}</td>
                  <td>${delivery.urgency}</td>
                  <td>${delivery.Driver?.name || 'Desconhecido'}</td>
                  <td>${delivery.Vehicle ? `${delivery.Vehicle.model} (${delivery.Vehicle.licensePlate})` : 'Desconhecido'}</td>
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
      orientation: 'portrait',
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
