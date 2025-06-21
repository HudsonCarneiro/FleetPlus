export const sanitizeNumber = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[^\d]/g, '').trim();
};
