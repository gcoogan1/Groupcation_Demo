/* eslint-disable @typescript-eslint/no-explicit-any */

import { BoatUITable } from "../../types/boatTable.types";
import { BusUITable } from "../../types/busTable.types";
import {
  GroupedTravelItems,
  TravelItem,
  TravelPeriod,
} from "../../types/filter.types";
import { FlightUITable } from "../../types/flightTable.types";
import { GroupcationTable } from "../../types/groupcationTable";
import { StayUITable } from "../../types/stayTable.types";
import { TrainUITable } from "../../types/trainTable.types";
import { UserTable } from "../../types/userTable";
import {
  convertTimeToString,
  formatDateToDayMonthYear,
  formatDayOfWeek,
} from "../dateFunctions/dateFunctions";

// --- Helper Functions --- //
// convert snake_case to camelCase
const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, group1) => group1.toUpperCase());

// convert camelCase to snake_case
const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

// transform object keys in arrays or objects, selectively based on a condition
const transformKeys = (
  data: any,
  transformFn: (str: string) => string,
  keysToTransform?: string[]
): any => {
  if (Array.isArray(data)) {
    return data.map((item) =>
      transformKeys(item, transformFn, keysToTransform)
    ); // Handle array of objects
  }

  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        // Transform key only if it's in the keysToTransform array or transform all keys by default
        if (!keysToTransform || keysToTransform.includes(key)) {
          return [transformFn(key), value];
        }
        return [key, value];
      })
    );
  }

  return data;
};

const convertFullNameToInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`;
};

// -- Conversion Functions -- //
export const transformToCamelCase = (
  data: any,
  keysToTransform?: string[]
): any => transformKeys(data, toCamelCase, keysToTransform);

export const transformToSnakeCase = (
  data: any,
  keysToTransform?: string[]
): any => transformKeys(data, toSnakeCase, keysToTransform);

export const replaceNullWithUndefined = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = obj[key] === null ? undefined : obj[key];
    return acc;
  }, {} as Record<string, any>);
};

export const convertUsersToTravelers = (userArray: UserTable[]) => {
  return userArray.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));
};

export const createdByUserInfo = (
  createdBy: number,
  userArray: UserTable[]
) => {
  return userArray.find((user) => user.id === createdBy);
};

type TravelerTable = {
  traveler_id: number;
  traveler_full_name: string;
};

export const convertTableTraveler = (
  travelerArray: TravelerTable[],
  users: UserTable[]
) => {
  return travelerArray.map((traveler) => {
    const matchedUser = users.find((user) => user.id === traveler.traveler_id);

    return {
      initials: matchedUser
        ? convertFullNameToInitials(matchedUser.firstName, matchedUser.lastName)
        : "",
      color: matchedUser ? matchedUser.avatarColor : "gray",
    };
  });
};

export const convertUsersToTravelersFilter = (userArray: UserTable[]) => {
  return userArray.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
    initials: convertFullNameToInitials(user.firstName, user.lastName),
    color: user.avatarColor,
    action: "checkbox",
  }));
};

export const groupTravelItemsByDate = (
  boats: BoatUITable[],
  buses: BusUITable[],
  stays: StayUITable[],
  flights: FlightUITable[],
  trains: TrainUITable[],
  groupcation: GroupcationTable
): GroupedTravelItems => {
  const grouped: GroupedTravelItems = {};

  // GROUPCATION DATES
  const groupcationStart = new Date(groupcation.startDate);
  const groupcationEnd = new Date(groupcation.endDate);

  // --> Helper Function -> Get/Set time period between groupcation date
  const getPeriod = (date: Date): TravelPeriod => {
    if (date < groupcationStart) return "before";
    if (date > groupcationEnd) return "after";
    return "during";
  };

  // --> Helper Function -> Format date and add item to date
  const pushItem = (item: TravelItem) => {
    const dateKey = formatDateToDayMonthYear(item.date.toDateString());

    // Check if date is in grouped array, if not, add a new array for that date
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    // Add the item to the array for that date
    grouped[dateKey].push(item);
  };

  // CHECK BOATS TO ADD ENTRY
  // Loop through all buses and add each with a departureDate to the grouped list
  boats.forEach((boat) => {
    if (boat.departureDate) {
      const date = new Date(boat.departureDate);
      pushItem({
        ...boat,
        type: "boat",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK BUSES TO ADD ENTRY
  // Loop through all buses and add each with a departureDate to the grouped list
  buses.forEach((bus) => {
    if (bus.departureDate) {
      const date = new Date(bus.departureDate);
      pushItem({
        ...bus,
        type: "bus",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK STAYS TO ADD ENTRY
  // Loop through all stays and add each with a checkIn to the grouped list
  stays.forEach((stay) => {
    if (stay.checkInDate) {
      const date = new Date(stay.checkInDate);
      pushItem({
        ...stay,
        type: "stay",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK FLIGHTS TO ADD ENTRY
  // Loop through all flights and add each with a departureDate to the grouped list
  flights.forEach((flight) => {
    if (flight.departureDate) {
      const date = new Date(flight.departureDate);
      pushItem({
        ...flight,
        type: "flight",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK TRAINS TO ADD ENTRY
  // Loop through all trains and add each with a departureDate to the grouped list
  trains.forEach((train) => {
    if (train.departureDate) {
      const date = new Date(train.departureDate);
      pushItem({
        ...train,
        type: "train",
        date,
        period: getPeriod(date),
      });
    }
  });

  return grouped;
};

export const formatDateTimeForCard = (time: string, date: string | Date) => {
  return `${convertTimeToString(time)} - ${formatDayOfWeek(
    date
  )}, ${formatDateToDayMonthYear(date.toString())}`;
};
