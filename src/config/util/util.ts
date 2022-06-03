export const generateRandomNumber = (max: number, min: number): number =>
  Math.round(Math.random() * (max - min) + min);
