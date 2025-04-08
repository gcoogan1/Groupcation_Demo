import { GroupcationDate, GroupedTravelItems, RenderableDay, TravelItem } from "../../types/filter.types";

/**
 * Returns renderable days with all groupcation "during" dates,
 * and only shows "before"/"after" dates if they have matching items (e.g., after filtering).
 */
export const getRenderableDays = (
  filteredGrouped: GroupedTravelItems,
  groupcationDates: GroupcationDate[]
): RenderableDay[] => {
  const renderable: RenderableDay[] = [];

  // Add all groupcation "during" dates (always show these even if no items)
  groupcationDates.forEach(({ date, dow, dayNumber }) => {
    const items = (filteredGrouped[date] as TravelItem[]) || [];

    renderable.push({
      date,
      dow,
      period: "during",
      dayNumber,
      items,
    });
  });

  // Add only "before" and "after" dates IF they exist in filteredGrouped AND have items
  Object.entries(filteredGrouped).forEach(([dateKey, itemsRaw]) => {
    const items = itemsRaw as TravelItem[];
    const period = items[0].period;

    // Skip if period is 'during' since that's already handled above
    if ((period === "before" || period === "after") && items.length > 0) {
      renderable.push({
        date: dateKey,
        dow: items[0].date.toLocaleDateString("en-US", { weekday: "short" }),
        period,
        dayNumber: undefined, // No day number for before/after
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
