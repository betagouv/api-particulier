export function parseEuro(str?: string): number | undefined {
  if (str === undefined) {
    return undefined;
  }
  const data = str.replace(/[^0-9]/g, '');
  if (data === '') {
    return undefined;
  }
  return isNumeric(data) ? parseInt(data) : 0;
}

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(parseInt(n));
}

export function parseDateOrString(
  str?: string
): Date | '-' | string | undefined {
  if (str === undefined) {
    return str;
  }
  if (str.trim() === '-') {
    return '-';
  }
  if (str.indexOf('/') === -1) {
    return str.trim();
  }
  const [date, month, year] = str.trim().split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date), 0, 0);
}
