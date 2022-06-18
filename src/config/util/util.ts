export const generateRandomNumber = (max: number, min: number): number =>
  Math.round(Math.random() * (max - min) + min);

export const computeTimeDifference = (date1: Date, date2: Date) =>
  Math.abs(date1.getTime() - date2.getTime());
