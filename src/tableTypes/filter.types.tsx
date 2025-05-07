import React from "react";
import { avatarTheme, theme } from "../styles/theme";
import Stay from "../assets/Stay.svg?react";
import Flight from "../assets/Flight.svg?react";
import Train from "../assets/Train.svg?react";
import Bus from "../assets/Bus.svg?react";
import Boat from "../assets/Boat.svg?react";
import Rental from "../assets/Rental.svg?react";
import Event from "../assets/Event.svg?react";
import Celebration from "../assets/Celebration.svg?react";
import Resturant from "../assets/Restaurant.svg?react";
import Walking from "../assets/Walking.svg?react";
import Driving from "../assets/Driving.svg?react";
import Note from "../assets/Note.svg?react";
import GroupcationIcon from "../assets/Groupcation_icon.svg?react";
import { StayUITable } from "./stayTable.types";
import { FlightUITable } from "./flightTable.types";
import { TrainUITable } from "./trainTable.types";
import { BusUITable } from "./busTable.types";
import { BoatUITable } from "./boatTable.types";
import { RentalUITable } from "./rentalTable.types";
import { EventUITable } from "./eventTable.types";
import { RestaurantUITable } from "./restaurantTable.types";
import { CelebrationUITable } from "./celebrationTable.types";
import { DrivingRouteUITable } from "./drivingRouteTable";
import { WalkingRouteUITable } from "./walkingRouteTable";
import { NoteUITable } from "./noteTable.types";
import { LinkedTripUITable } from "./linkedTripsTable.types";

type Actions = "checkbox" | "switch";
type ThemeKeys = keyof typeof theme;
type AvatarThemeKeys = keyof typeof avatarTheme;

export type FilterItems = {
  action: Actions;
  icon: React.ReactNode;
  label: string;
  value: ThemeKeys;
};

export type TravelerUIInfo = {
  initials: string;
  color: AvatarThemeKeys;
  travelerFullName?: string;
  relationshipToCreator?: string
};

export type TravelerItems = {
  action: Actions;
  label: string;
  value: number;
  color: ThemeKeys;
};

export type TravelPeriod = "before" | "during" | "after";

type BaseTravelItem = {
  date: Date;
  period: TravelPeriod;
};

export type TrainItem = TrainUITable & BaseTravelItem & { type: "train" };
export type FlightItem = FlightUITable & BaseTravelItem & { type: "flight" };
export type StayItem = StayUITable & BaseTravelItem & { type: "stay" };
export type BusItem = BusUITable & BaseTravelItem & { type: "bus" };
export type BoatItem = BoatUITable & BaseTravelItem & { type: "boat" };
export type RentalItem = RentalUITable & BaseTravelItem & { type: "rental" };
export type EventItem = EventUITable & BaseTravelItem & { type: "event" };
export type RestaurantItem = RestaurantUITable &
  BaseTravelItem & { type: "restaurant" };
export type CelebrationItem = CelebrationUITable &
  BaseTravelItem & { type: "celebration" };
export type DrivingRouteItem = DrivingRouteUITable &
  BaseTravelItem & { type: "drivingRoute" };
export type WalkingRouteItem = WalkingRouteUITable &
  BaseTravelItem & { type: "walkingRoute" };
export type NoteItem = NoteUITable & BaseTravelItem & { type: "note" };
export type LinkedTripItem = LinkedTripUITable & BaseTravelItem & { type: "linkedTrip" };

export type TravelItem =
  | TrainItem
  | FlightItem
  | StayItem
  | BusItem
  | BoatItem
  | RentalItem
  | EventItem
  | RestaurantItem
  | CelebrationItem
  | DrivingRouteItem
  | WalkingRouteItem
  | NoteItem
  | LinkedTripItem;

export type GroupedTravelItems = Record<string, TravelItem[]>;

export type GroupcationDate = {
  date: string;
  dow: string;
  dayNumber: number;
};

export type RenderableDay = {
  date: string;
  dow: string;
  items: TravelItem[];
  period: TravelPeriod;
  dayNumber?: number; // only for 'during'
};

export const ACTIVITY_OPTIONS: FilterItems[] = [
  {
    action: "checkbox",
    icon: <Stay color={theme.base} />,
    label: "Stays",
    value: "stay",
  },
  {
    action: "checkbox",
    icon: <Flight color={theme.base} />,
    label: "Flights",
    value: "flight",
  },
  {
    action: "checkbox",
    icon: <Train color={theme.base} />,
    label: "Trains",
    value: "train",
  },
  {
    action: "checkbox",
    icon: <Bus color={theme.base} />,
    label: "Buses",
    value: "bus",
  },
  {
    action: "checkbox",
    icon: <Boat color={theme.base} />,
    label: "Boats",
    value: "boat",
  },
  {
    action: "checkbox",
    icon: <Rental color={theme.base} />,
    label: "Rentals",
    value: "rental",
  },
  {
    action: "checkbox",
    icon: <Event color={theme.base} />,
    label: "Events",
    value: "event",
  },
  {
    action: "checkbox",
    icon: <Celebration color={theme.base} />,
    label: "Celebrations",
    value: "celebration",
  },
  {
    action: "checkbox",
    icon: <Resturant color={theme.base} />,
    label: "Restaurants",
    value: "restaurant",
  },
];

export const ROUTES_OPTIONS: FilterItems[] = [
  {
    action: "checkbox",
    icon: <Walking color={theme.walkingRoute} />,
    label: "Walking",
    value: "walkingRoute",
  },
  {
    action: "checkbox",
    icon: <Driving color={theme.drivingRoute} />,
    label: "Driving",
    value: "drivingRoute",
  },
];

export const EXTRAS_OPTIONS: FilterItems[] = [
  {
    action: "checkbox",
    icon: <Note color={theme.note} />,
    label: "Notes",
    value: "note",
  },
  {
    action: "checkbox",
    icon: <GroupcationIcon color={theme.groupcation} />,
    label: "Linked Trip",
    value: "groupcationOpacity",
  },
];
