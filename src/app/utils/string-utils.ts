export const moneyFormatter = (money: number): string => {
  const str = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
  }).format(money);
  return str;
};
export type GroupedData<T> = Record<string, T[]>

export const groupBy = <T>(xs: T[], key: keyof T): GroupedData<T> => {
  return xs.reduce((rv: GroupedData<T>, x: T) => {
      const keyValue = x[key] as string; // Mengasumsikan nilai kunci bertipe string
      (rv[keyValue] = rv[keyValue] ?? []).push(x);
      return rv;
  }, {});
};
export const generateId = () => {
  const random = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const date = new Date();
  return `${random}${padText(date.getMonth().toString())}${padText(
      date.getDate().toString()
  )}`;
};

const padText = (str: string) => {
  if (str.length >= 2) return str;
  return str.padStart(2, "0");
};

export const calculateTax = (total: number) => {
  return (total * 10) / 100;
};

export const calculateTaxOrDiscount = (
  totalPerPerson: number,
  totalPrice: number,
  total: number
) => {
  return (totalPerPerson / totalPrice) * total;
};

export const generateStr = (length: number) => {
  let result = "";
  const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
      result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
      );
      counter += 1;
  }
  return result;
};

export const calculatePromo = (
  total: number,
  promo: number,
  promoType: string
) => {
  if (promoType === "FIX") {
      return promo;
  }

  return (promo / 100) * total;
};