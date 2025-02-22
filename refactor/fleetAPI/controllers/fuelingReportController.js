const Fueling = require('../models/Fueling');
const { getDriverAll } = require('./driverController');
const { getVehicleAll } = require('./vehicleController');
const htmlPdf = require('html-pdf'); 
const path = require('path');

exports.exportFuelingReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca todas os abastecimentos
    const fuelings = await Fueling.findAll({ where: { userId } });

    if (!fuelings.length) {
      return res.status(404).json({ error: 'Nenhum abastecimento encontrado.' });
    }

    // Busca todos os motoristas do usuário
    let drivers = [];
    try {
      const driversResponse = await new Promise((resolve, reject) => {
        getDriverAll(
          { query: { userId } },
          { status: (statusCode) => ({ json: resolve, send: reject }) }
        );
      });
      drivers = Array.isArray(driversResponse) ? driversResponse : [];
    } catch {
      console.warn('Falha ao obter motoristas.');
    }

    // Busca todos os veículos do usuário
    let vehicles = [];
    try {
      const vehiclesResponse = await new Promise((resolve, reject) => {
        getVehicleAll(
          { query: { userId } },
          { status: (statusCode) => ({ json: resolve, send: reject }) }
        );
      });
      vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : [];
    } catch {
      console.warn('Falha ao obter veículos.');
    }

    // Associa os dados aos abastecimentos
    const fuelingssWithDetails = fuelings.map((fueling) => {
      const driver = drivers.find((d) => d.id === fueling.driverId) || null;
      const vehicle = vehicles.find((v) => v.id === fueling.vehicleId) || null;

      return {
        ...fueling.toJSON(),
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
            text-align: left;
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
        <h1>Relatório de Abastecimentos</h1>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Litros</th>
              <th>Preço Total</th>
              <th>Quilometragem</th>
            </tr>
          </thead>
         <tbody>
          ${fuelingssWithDetails
            .map((fueling) => `
              <tr>
                <td>${new Date(fueling.dateFueling).toLocaleDateString() || 'Não definida'}</td>
                <td>${fueling.Driver?.name || 'Desconhecido'}</td>
                <td>${fueling.Vehicle ? `${fueling.Vehicle.model} (${fueling.Vehicle.licensePlate})` : 'Desconhecido'}</td>
                <td>${fueling.liters ? `${fueling.liters} L` : 'Não informado'}</td>
                <td>R$ ${(Number(fueling.price) || 0).toFixed(2)}</td>
                <td>${fueling.mileage ? `${fueling.mileage} km` : 'Não informado'}</td>
              </tr>
            `)
            .join('')}
        </tbody>

        </table>
      </body>
      </html>
    `;

    // Caminho para salvar o PDF
    const filePath = path.join(__dirname, `../../downloads/fueling-report-${userId}.pdf`);

    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
    };

    // Gera o PDF
    htmlPdf.create(html, options).toFile(filePath, (err, result) => {
      if (err) {
        console.error('Erro ao gerar o PDF:', err.message);
        return res.status(500).json({ error: 'Erro ao gerar o PDF.' });
      }

      // Envia o PDF como download
      res.download(result.filename, `relatorio-abastecimentos-${userId}.pdf`, () => {
        console.log('Relatório gerado e enviado:', result.filename);
      });
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de abastecimentos:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de abastecimentos.',
      details: error.message,
    });
  }
};
