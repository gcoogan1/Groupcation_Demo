import {
  GroupcationDate,
  GroupedTravelItems,
  RenderableDay,
  TravelItem,
} from "@tableTypes/filter.types";

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
] as const;

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

/**
 * Filter each day item by time.
 */
const getItemTime = (item: any): number => {
  // Try every date field
  for (const dateField of dateFields) {
    const dateVal = item[dateField];
    if (!dateVal) continue;

    // For each date, check if there's a matching time field
    for (const timeField of timeFields) {
      const timeVal = item[timeField];
      if (!timeVal) continue;

      try {
        const date = new Date(dateVal);
        const time = new Date(timeVal);

        const timestamp = new Date(timeVal).getTime();
        if (!isNaN(timestamp)) {
          return timestamp;
        }
      } catch (err) {
        console.error("Error parsing time:", err);
      }
    }

    // If date exists but no time, use just the date
    const dateOnly = new Date(dateVal).getTime();
    if (!isNaN(dateOnly)) {
      return dateOnly;
    }
  }

  // If none of the above worked, try the generic "date" field
  if (item.date) {
    const fallbackDate = new Date(item.date).getTime();
    if (!isNaN(fallbackDate)) {
      return fallbackDate;
    }
  }

  return 0;
};

/**
 * Returns renderable days with all groupcation "during" dates,
 * and only shows "before"/"after" dates if they have matching items (e.g., after filtering).
 */
export const getRenderableDays = (
  filteredGrouped: GroupedTravelItems,
  groupcationDates: GroupcationDate[]
): RenderableDay[] => {
  const renderable: RenderableDay[] = [];
  const duringDates = new Set(groupcationDates?.map(({ date }) => date));

  // Add all groupcation "during" dates (always shown)
  groupcationDates?.forEach(({ date, dow, dayNumber }) => {
    const items = (filteredGrouped[date] as TravelItem[]) || [];
    const sortedItems = [...items].sort(
      (a, b) => getItemTime(a) - getItemTime(b)
    );

    renderable.push({
      date,
      dow,
      period: "during",
      dayNumber,
      items: sortedItems,
    });
  });

  // Add only "before" and "after" dates if they exist and aren't already included
  Object.entries(filteredGrouped).forEach(([dateKey, itemsRaw]) => {
    const items = itemsRaw as TravelItem[];

    if (!items.length) return;

    const period = items[0].period;

    // Skip "during" dates that were already added above
    if (duringDates.has(dateKey)) return;

    if (period === "before" || period === "after") {
      // Sort days (items) by time for each day
      const sortedItems = [...items].sort(
        (a, b) => getItemTime(a) - getItemTime(b)
      );

      renderable.push({
        date: dateKey,
        dow: sortedItems[0].date.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        period,
        dayNumber: undefined,
        items: sortedItems,
      });
    }
  });

  // Sort days by date
  renderable.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return renderable;
};
