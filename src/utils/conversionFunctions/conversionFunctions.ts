/* eslint-disable @typescript-eslint/no-explicit-any */

import { BoatUITable } from "@tableTypes/boatTable.types";
import { BusUITable } from "@tableTypes/busTable.types";
import { CelebrationUITable } from "@tableTypes/celebrationTable.types";
import { EventUITable } from "@tableTypes/eventTable.types";
import {
  GroupedTravelItems,
  TravelItem,
  TravelPeriod,
} from "@tableTypes/filter.types";
import { FlightUITable } from "@tableTypes/flightTable.types";
import { GroupcationTable } from "@tableTypes/groupcationTable";
import { RentalUITable } from "@tableTypes/rentalTable.types";
import { RestaurantUITable } from "@tableTypes/restaurantTable.types";
import { StayUITable } from "@tableTypes/stayTable.types";
import { TrainUITable } from "@tableTypes/trainTable.types";
import { UserTable } from "@tableTypes/userTable";
import {
  convertTimeToString,
  formatDateToDayMonthYear,
  formatDayOfWeek,
} from "../dateFunctions/dateFunctions";
import { DrivingRouteUITable } from "@/tableTypes/drivingRouteTable";
import { WalkingRouteUITable } from "@/tableTypes/walkingRouteTable";

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
  walkingRoutes: WalkingRouteUITable[],
  drivingRoutes: DrivingRouteUITable[],
  celebrations: CelebrationUITable[],
  restaurants: RestaurantUITable[],
  events: EventUITable[],
  rentals: RentalUITable[],
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

  // CHECK WALKING ROUTES TO ADD ENTRY
  // Loop through all walking routes and add each with a departureDate to the grouped list
  walkingRoutes.forEach((walkingRoute) => {
    if (walkingRoute.departureDate) {
      const date = new Date(walkingRoute.departureDate);
      pushItem({
        ...walkingRoute,
        type: "walkingRoute",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK DRIVING ROUTES TO ADD ENTRY
  // Loop through all driving routes and add each with a departureDate to the grouped list
  drivingRoutes.forEach((drivingRoute) => {
    if (drivingRoute.departureDate) {
      const date = new Date(drivingRoute.departureDate);
      pushItem({
        ...drivingRoute,
        type: "drivingRoute",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK CELEBRATIONS TO ADD ENTRY
  // Loop through all celebrations and add each with a startDate to the grouped list
  celebrations.forEach((celebration) => {
    if (celebration.startDate) {
      const date = new Date(celebration.startDate);
      pushItem({
        ...celebration,
        type: "celebration",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK RESTAURANTS TO ADD ENTRY
  // Loop through all restaurants and add each with a reservationDate to the grouped list
  restaurants.forEach((restaurant) => {
    if (restaurant.reservationDate) {
      const date = new Date(restaurant.reservationDate);
      pushItem({
        ...restaurant,
        type: "restaurant",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK EVENTS TO ADD ENTRY
  // Loop through all events and add each with a departureDate to the grouped list
  events.forEach((event) => {
    if (event.startDate) {
      const date = new Date(event.startDate);
      pushItem({
        ...event,
        type: "event",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK RENTALS TO ADD ENTRY
  // Loop through all rentals and add each with a departureDate to the grouped list
  rentals.forEach((rental) => {
    if (rental.pickUpDate) {
      const date = new Date(rental.pickUpDate);
      pushItem({
        ...rental,
        type: "rental",
        date,
        period: getPeriod(date),
      });
    }
  });

  // CHECK BOATS TO ADD ENTRY
  // Loop through all boats and add each with a departureDate to the grouped list
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
