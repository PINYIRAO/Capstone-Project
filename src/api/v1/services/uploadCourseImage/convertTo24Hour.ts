// convert the time
export const convertTo24Hour = (time: string): number => {
  const [hourMin, period] = time.split(" ");
  const [hour, minute] = hourMin.split(":").map(Number);
  let newHour: number = hour;

  if (period === "PM" && hour !== 12) {
    newHour = hour + 12;
  }
  if (period === "AM" && hour === 12) {
    newHour = 0;
  }

  // sometimes OCR can't get the corret time, just is a empty string
  // to aviod the consequence error, return 0 here
  if (isNaN(newHour * 100 + minute)) {
    return 0;
  }

  return newHour * 100 + minute; // convert 3:00 PM into 1500 format
};
