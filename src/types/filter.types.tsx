import React from "react";
import { theme } from "../styles/theme";
import Stay from "../assets/Stay.svg?react"
import Flight from "../assets/Flight.svg?react";
import Train from "../assets/Train.svg?react";
import Bus from "../assets/Bus.svg?react";
import Boat from "../assets/Boat.svg?react";
import Rental from "../assets/Rental.svg?react";
import Event from "../assets/Event.svg?react";
import Celebration from "../assets/Celebration.svg?react";
import Resturant from "../assets/Restaurant.svg?react";
import { StayTable } from "./stayTable.types";
import { FlightUITable } from "./flightTable.types";
import { TrainUITable } from "./trainTable.types";

type Actions = "checkbox" | "switch";
type ThemeKeys = keyof typeof theme;

export type FilterItems = {
  action: Actions,
  icon: React.ReactNode;
  label: string,
  value: ThemeKeys
}

export type TravelerItems = {
  action: Actions,
  label: string,
  value: number,
  color: ThemeKeys
}

export type TravelPeriod = 'before' | 'during' | 'after';

type BaseTravelItem = {
  date: Date;
  period: TravelPeriod;
};

export type TrainItem = TrainUITable & BaseTravelItem & { type: 'train' };
export type FlightItem = FlightUITable & BaseTravelItem & { type: 'flight' };
export type StayItem = StayTable & BaseTravelItem & { type: 'stay' };

export type TravelItem = TrainItem | FlightItem | StayItem;

export type GroupedTravelItems = Record<string, TravelItem[]>;

export type GroupcationDate = {
  date: string;
  dow: string;
  dayNumber: number;
}

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
    value: "stay"
  },
  {
    action: "checkbox",
    icon: <Flight color={theme.base} />,
    label: "Flights",
    value: "flight"
  },
  {
    action: "checkbox",
    icon: <Train color={theme.base} />,
    label: "Trains",
    value: "train"
  },
  {
    action: "checkbox",
    icon: <Bus color={theme.base} />,
    label: "Buses",
    value: "bus"
  },
  {
    action: "checkbox",
    icon: <Boat color={theme.base} />,
    label: "Boats",
    value: "boat"
  },
  {
    action: "checkbox",
    icon: <Rental color={theme.base} />,
    label: "Rentals",
    value: "rental"
  },
  {
    action: "checkbox",
    icon: <Event color={theme.base} />,
    label: "Events",
    value: "event"
  },
  {
    action: "checkbox",
    icon: <Celebration color={theme.base} />,
    label: "Celebrations",
    value: "celebration"
  },
  {
    action: "checkbox",
    icon: <Resturant color={theme.base} />,
    label: "Restaurants",
    value: "restaurant"
  },
];