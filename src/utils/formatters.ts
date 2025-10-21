export const formatNumber = (num: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(num);

export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions
) => {
  if (!dateString || !dateString.includes("-")) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", options);
};

export const formatDaysToDate = (days: number): string => {
  if (typeof days !== "number" || !isFinite(days) || days < 0) return "";
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};
