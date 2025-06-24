import ReportService from '../services/ReportServices';

export const handleExportVehicles = async () => {
  try {
    await ReportService.exportVehiclesToPDF();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleExportMaintenances = async () => {
  try {
    await ReportService.exportMaintenancesToPDF();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleExportFuelings = async () => {
  try {
    await ReportService.exportFuelingsToPDF();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleExportDrivers = async () => {
  try {
    await ReportService.exportDriversToPDF();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleExportDeliveries = async () => {
  try {
    await ReportService.exportDeliveriesToPDF();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
