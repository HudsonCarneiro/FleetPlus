const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const ServiceProvider = require('../models/ServiceProvider');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

exports.exportMaintenanceReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const maintenances = await Maintenance.findAll({ where: { userId } });
    if (!maintenances.length) {
      return res.status(404).json({ error: 'Nenhuma manutenção encontrada.' });
    }

    const emissionDate = new Date().toLocaleDateString('pt-BR');

    // Busca direta sem Express response
    const vehicles = await Vehicle.findAll({ where: { userId } });
    const providers = await ServiceProvider.findAll({ where: { userId } });

    const maintenancesWithDetails = maintenances.map((m) => {
      const vehicle = vehicles.find((v) => v.id === m.vehicleId);
      const provider = providers.find((p) => p.id === m.serviceProviderId);

      return {
        ...m.toJSON(),
        vehicleName: vehicle ? `${vehicle.model} (${vehicle.plate})` : 'Não informado',
        providerName: provider ? provider.businessName : 'Não informado',
      };
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; }
          .date { text-align: center; font-size: 12px; color: #555; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #eee; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Relatório de Manutenções</h1>
        <div class="date">Emitido em: ${emissionDate}</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Veículo</th>
              <th>Fornecedor</th>
              <th>Nota Fiscal</th>
              <th>Preço</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${maintenancesWithDetails
              .map(
                (m) => `
              <tr>
                <td>${m.id}</td>
                <td>${m.date ? m.date.toISOString().substr(0,10).split("-").reverse().join("/") : "-"}</td>
                <td>${m.type}</td>
                <td>${m.description || '-'}</td>
                <td>${m.vehicleName}</td>
                <td>${m.providerName}</td>
                <td>${m.nfe || '-'}</td>
                <td>R$ ${Number(m.price).toFixed(2)}</td>
                <td>${m.status}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const filePath = path.join(
      __dirname,
      `../../downloads/maintenance-report-${userId}.pdf`
    );

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.pdf({ path: filePath, format: 'A4', landscape: true });
    await browser.close();

    res.download(filePath, `relatorio-manutencao-${userId}.pdf`, () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de manutenção:', error.message);
    res
      .status(500)
      .json({ error: 'Erro ao gerar relatório.', details: error.message });
  }
};
