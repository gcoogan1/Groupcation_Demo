import {
  GroupcationDate,
  GroupedTravelItems,
  RenderableDay,
  TravelItem,
} from "@tableTypes/filter.types";

/**
 * Returns renderable days with all groupcation "during" dates,
 * and only shows "before"/"after" dates if they have matching items (e.g., after filtering).
 */
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

type TimeField = (typeof timeFields)[number];

const getTime = (item: TravelItem): number => {
  for (const field of timeFields) {
    if (field in item) {
      const value = item[field as keyof typeof item];
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.getTime();
        }
      }
    }
  }
  return Infinity; // fallback for missing or invalid time
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
    const sortedItems = [...items].sort((a, b) => getTime(a) - getTime(b));

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
      const sortedItems = [...items].sort((a, b) => getTime(a) - getTime(b));

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
