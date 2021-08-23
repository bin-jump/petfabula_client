export const endOfToday = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
};

export const isPositive = (val: number | undefined) => {
  if (!val) {
    return false;
  }
  return val > 0;
};

export const recordDateTimeSpan = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};
