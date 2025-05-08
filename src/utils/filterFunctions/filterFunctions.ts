import { groupTravelItemsByDate } from "../conversionFunctions/conversionFunctions";

// FILTERS THE GROUPED TRAVEL ITEMS BY SELECTED TYPES AND TRAVELERS
/**
 * .reduce() is a method that takes a list (array) 
    and boils it down to one single value — often an object, array, number, or string.
 * 
 * This function starts with an empty object. Then, for each day in the grouped data:
 *   - Filters out any travel items (activities, routes, extras) that don't match the selected types.
 *   - Also filters out any items that don't include any of the selected travelers.
 *   - If any items are left for that day, it adds that day and those items to the final result.
 * 
 * This continues for every day in the grouped object.
 * 
 * Finally, it returns a new object with only the filtered dates and items.
 */

export const filterGroups = (
  grouped: ReturnType<typeof groupTravelItemsByDate>,
  selectedActivities: string[],
  selectedTravelers: string[],
  selectedRoutes: string[],
  selectedExtras: string[]
) => {
  // Convert selected traveler IDs to numbers for comparison
  const selectedTravelerIds = selectedTravelers.map((id) => Number(id));

  const filteredGrouped = Object.entries(grouped).reduce(
    (acc, [date, items]) => {
      // Filter items by date
      const filteredItems = items.filter((item) => {
        // --- TYPE FILTERS --- //
        // Check if item matches selected activity types
        const matchesActivity =
          selectedActivities.length > 0 &&
          selectedActivities.includes(item.type);

        // Check if item matches selected route types
        const matchesRoute =
          selectedRoutes.length > 0 && selectedRoutes.includes(item.type);

        // Check if item matches selected extra types
        const matchesExtra =
          selectedExtras.length > 0 && selectedExtras.includes(item.type);

        // If no filters are selected, include everything
        // Otherwise, include items that match *any* selected type
        const matchesAnyType =
          selectedActivities.length === 0 &&
          selectedRoutes.length === 0 &&
          selectedExtras.length === 0
            ? true
            : matchesActivity || matchesRoute || matchesExtra;

        // --- TRAVELER FILTER --- //
        // Only include items with matching travelers (if travelers are selected)
        const matchesTraveler =
          selectedTravelerIds.length > 0
            ? // Narrow down to TravelItem type that has the travelers property
              "travelers" in item &&
              item.travelers?.some((traveler) =>
                selectedTravelerIds.includes(traveler.travelerId)
              )
            : true; // No traveler filter = include all

        // Return true only if item matches both filters
        return matchesAnyType && matchesTraveler;
      });

      // If there are any filtered items for this date, add them to the result
      if (filteredItems.length > 0) {
        acc[date] = filteredItems;
      }

      return acc;
    },
    {} as typeof grouped // Initial accumulator type matches grouped
  );

  return filteredGrouped;
};
