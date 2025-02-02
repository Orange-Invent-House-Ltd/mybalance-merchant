export const formatToNairaCurrency = (amount: any) => {
  const format = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
  return format;
};

export const formatToDollarCurrency = (amount: any) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
  return format;
};
