import API_BASE_URL from '../constants/api';
import { getTokenFromSession, getUserIdFromSession } from '../utils/ApiRequest';

const downloadBinaryReport = async (endpoint, filenamePrefix) => {
  const userId = getUserIdFromSession();
  const token = getTokenFromSession();

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!token) throw new Error('Token não encontrado.');

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append('userId', userId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erro ao baixar o relatório: ${response.status} - ${errorText}`
    );
  }

  const blob = await response.blob();
  const fileURL = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = fileURL;
  a.download = `${filenamePrefix}-${userId}.pdf`;
  a.click();
  window.URL.revokeObjectURL(fileURL);
};

const ReportService = {
  exportVehiclesToPDF: () =>
    downloadBinaryReport('/vehicles/report', 'relatorio-veiculos'),

  exportMaintenancesToPDF: () =>
    downloadBinaryReport('/maintenances/report', 'relatorio-manutencao'),

  exportFuelingsToPDF: () =>
    downloadBinaryReport('/fuelings/report', 'relatorio-abastecimentos'),

  exportDriversToPDF: () =>
    downloadBinaryReport('/drivers/report', 'relatorio-motoristas'),

  exportDeliveriesToPDF: () =>
    downloadBinaryReport('/deliveries/report', 'relatorio-entregas'),
};

export default ReportService;
