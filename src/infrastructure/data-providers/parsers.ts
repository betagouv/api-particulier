export const parseDate = (date: string): Date => {
  return new Date(date.split('T')[0]);
};
