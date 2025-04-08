import { differenceInMinutes, parseISO } from "date-fns";
import { eachDayOfInterval } from "date-fns";
import { format } from "date-fns";

export const convertDateToString = (value: Date | string) => {
  if (value instanceof Date) {
    return value.toISOString();
  } else if (typeof value === "string") {
    return value;
  }
};

// Formats time as 'h:mm AM/PM'
export const convertTimeToString = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // This ensures AM/PM format
  };

  // Get the time string in AM/PM format
  const timeString = date.toLocaleTimeString("en-US", options);

  // Convert AM/PM to lowercase and remove the space
  return timeString
    .replace(/(AM|PM)/, (match) => match.toLowerCase())
    .replace(" ", "");
};

export const formatDayOfWeek = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertFormDatesToString = (data: any) => {
  const convertedData = { ...data };

  const dateFields = [
    "departureDate",
    "arrivalDate",
    "checkInDate",
    "checkOutDate",
    "pickUpDate",
    "dropOffDate",
    "reservationDate",
    "startDate",
    "endDate",
  ];

  const timeFields = [
    "departureTime",
    "arrivalTime",
    "checkInTime",
    "checkOutTime",
    "pickUpTime",
    "dropOffTime",
    "reservationTime",
    "startTime",
    "endTime",
  ];

  dateFields.forEach((field) => {
    if (convertedData[field]) {
      convertedData[field] = formatDate(convertedData[field]);
    }
  });

  timeFields.forEach((field) => {
    if (convertedData[field]) {
      convertedData[field] = formatTime(convertedData[field]);
    }
  });

  return convertedData;
};

// Format as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format as HH:mm (24-hour) or h:mm a (12-hour)
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // or true if you want AM/PM
  });
};


export const formatDateToDayMonthYear = (dateString?: string): string => {
  if (!dateString) return "";
  return format(new Date(dateString), "dd MMMM yyyy");
};

export const getDaysRemaining = (targetDate: string) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - now.getTime();

  /* Math.ceil() ensures that if any time remains in the day (even a second),
  the function rounds up to the next whole number of days. 
  Think ceiling (always rounds up) */
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
};

export const getInBetweenDates = (startDate: string, endDate: string) => {
  const dates = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  const formatedDates = dates.map((date: Date, index: number) => {
    const stringDate = formatDateToDayMonthYear(date.toString());
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    return {
      date: stringDate,
      dow: dayOfWeek,
      dayNumber: index + 1,
    };
  });
  return formatedDates;
};

export const getDurationInHoursAndMinutes = (
  startDateStr: string,
  endDateStr: string
): string => {
  // Add 's' to plural values
  const pluralize = (unit: string, value: number) =>
    `${value} ${unit}${value !== 1 ? "s" : ""}`;

  // Convert string to Date object
  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);

  const totalMinutes = differenceInMinutes(endDate, startDate); // Get total minutes difference
  const hours = Math.floor(totalMinutes / 60); // Get hours
  const minutes = totalMinutes % 60; // Get remaining minutes

  if (hours > 0 && minutes > 0) {
    return `${pluralize("hour", hours)} ${pluralize("minute", minutes)}`;
  } else if (hours > 0) {
    return pluralize("hour", hours);
  } else if (minutes > 0) {
    return pluralize("minute", minutes);
  } else {
    return "0 minutes";
  }
};
