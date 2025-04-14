import { groupTravelItemsByDate } from "../conversionFunctions/conversionFunctions";

// FILTERS THE GROUPED TRAVEL ITEMS BY SELECTED ACTIVITY TYPES
/**
   * .reduce() is a method that takes a list (array) 
      and boils it down to one single value — often an object, array, number, or string.
   * Start with an empty object. Then, for each day in the grouped data:
        Filter out any activities that don't match what the user selected.
        If anything is left for that day, add that day and those items to the final result.
        Keep going until you've checked every day.
        Return the final object.
   */
export const filterGroups = (
  grouped: ReturnType<typeof groupTravelItemsByDate>,
  selectedActivities: string[],
  selectedTravelers: string[]
) => {
  // --- STEP 1: FILTER GROUPED ITEMS BY SELECTED ACTIVITIES ---
  const filteredGrouped = Object.entries(grouped).reduce(
    (acc, [date, items]) => {
      // Only include items that match selectedActivities
      const filteredItems = items.filter((item) => {
        const selectedTravelerIds = selectedTravelers.map((id) => Number(id));

        const matchesActivity =
          selectedActivities.length > 0
            ? selectedActivities.includes(item.type) // If activities are selected, filter by type
            : true;

        // Check if the activity has any travelers that match the selected travelers
        const matchesTraveler =
          selectedTravelerIds.length > 0
            ? item.travelers?.some(
                (traveler) => selectedTravelerIds.includes(traveler.traveler_id) // Compare traveler_id to selected traveler IDs
              )
            : true;

        return matchesActivity && matchesTraveler;
      });

      // If there are any filtered items for the date, add them to the accumulator
      if (filteredItems.length > 0) {
        acc[date] = filteredItems;
      }

      return acc;
    },
    {} as typeof grouped
  );

  return filteredGrouped;
};