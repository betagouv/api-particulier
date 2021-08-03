export function parseEuro(str: string) {
  const data = str.replace(/[^0-9]/g, '');
  return isNumeric(data) ? parseInt(data) : 0;
}

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(parseInt(n));
}

export function parseDateOrString(str: string): Date | '-' | string {
  if (str.trim() === '-') {
    return '-';
  }
  if (str.indexOf('/') === -1) {
    return str.trim();
  }
  const [date, month, year] = str.trim().split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date), 0, 0);
}
