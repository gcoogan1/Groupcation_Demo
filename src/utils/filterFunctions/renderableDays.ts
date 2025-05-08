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
export const getRenderableDays = (
  filteredGrouped: GroupedTravelItems,
  groupcationDates: GroupcationDate[]
): RenderableDay[] => {
  const renderable: RenderableDay[] = [];

  // Create a Set of "during" dates to avoid duplicates later
  const duringDates = new Set(groupcationDates?.map(({ date }) => date));

  // Add all groupcation "during" dates (always shown)
  groupcationDates?.forEach(({ date, dow, dayNumber }) => {
    const items = (filteredGrouped[date] as TravelItem[]) || [];

    renderable.push({
      date,
      dow,
      period: "during",
      dayNumber,
      items,
    });
  });

  // Add only "before" and "after" dates if they exist and aren't already included
  Object.entries(filteredGrouped).forEach(([dateKey, itemsRaw]) => {
    const items = itemsRaw as TravelItem[];
    const period = items[0].period;

    // Skip "during" dates that were already added above
    if (duringDates.has(dateKey)) return;

    if ((period === "before" || period === "after") && items.length > 0) {
      renderable.push({
        date: dateKey,
        dow: items[0].date.toLocaleDateString("en-US", { weekday: "long" }),
        period,
        dayNumber: undefined,
        items,
      });
    }
  });

  // Sort by date
  renderable.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return renderable;
};
