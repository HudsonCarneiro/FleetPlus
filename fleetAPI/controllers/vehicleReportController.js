const Vehicle = require('../models/Vehicle');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

exports.exportVehiclesReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // Busca os veículos
    const vehicles = await Vehicle.findAll({ where: { userId } });

    if (!vehicles.length) {
      return res.status(404).json({ error: 'Nenhum veículo encontrado.' });
    }

    const vehiclesWithDetails = vehicles.map((vehicle) => vehicle.toJSON());

    // Cria o conteúdo HTML do relatório
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              font-size: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Veículos</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Montadora</th>
                <th>Ano</th>
                <th>Combustível</th>
                <th>Quilometragem</th>
              </tr>
            </thead>
            <tbody>
              ${vehiclesWithDetails
                .map((v) => `
                  <tr>
                    <td>${v.id}</td>
                    <td>${v.plate || '---'}</td>
                    <td>${v.model || '---'}</td>
                    <td>${v.automaker || '---'}</td>
                    <td>${v.year || '---'}</td>
                    <td>${v.fuelType || '---'}</td>
                    <td>${v.mileage || '---'} km</td>
                  </tr>
                `)
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const filePath = path.join(__dirname, `../../downloads/vehicle-report-${userId}.pdf`);

    // Gera o PDF com Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    await page.pdf({
      path: filePath,
      format: 'A4',
      landscape: true,
      printBackground: true,
    });

    await browser.close();

    // Envia o arquivo como download
    res.download(filePath, `relatorio-veiculos-${userId}.pdf`, () => {
      fs.unlinkSync(filePath); // Remove o arquivo após envio
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de veículos:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de veículos.',
      details: error.message,
    });
  }
};
