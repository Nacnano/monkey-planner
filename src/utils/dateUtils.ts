export const createDueDate = (monthsToAdd: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
  // Adjust for end of month issues
  if (date.getDate() < new Date().getDate()) {
    date.setDate(0);
  }
  return date.toISOString().split("T")[0];
};
