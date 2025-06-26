const Driver = require('../models/Driver');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

exports.exportDriverReport = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const drivers = await Driver.findAll({ where: { userId } });
    if (!drivers.length) {
      return res.status(404).json({ error: 'Nenhum motorista encontrado.' });
    }

    const emissionDate = new Date().toLocaleDateString('pt-BR'); // exemplo: 26/06/2025

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          .date { text-align: center; font-size: 12px; color: #555; margin-bottom: 20px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
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
        <h1>Relatório de Motoristas</h1>
        <div class="date">Emitido em: ${emissionDate}</div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNH</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            ${drivers.map((driver) => `
              <tr>
                <td>${driver.id}</td>
                <td>${driver.name}</td>
                <td>${driver.cnh}</td>
                <td>${driver.phone || 'Não informado'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const filePath = path.join(__dirname, `../../downloads/driver-report-${userId}.pdf`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.pdf({ path: filePath, format: 'A4', landscape: true });
    await browser.close();

    res.download(filePath, `relatorio-motoristas-${userId}.pdf`, () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de motoristas:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório de motoristas.',
      details: error.message,
    });
  }
};
