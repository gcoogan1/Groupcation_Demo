import MenuItem from "../MenuItem/MenuItem";
import Pictogram from "../Pictogram/Pictogram";
import {
  PanelContainer,
  PanelSection,
  SectionHeader,
  SectionList,
} from "./Panel.styles";
import StayIcon from "../../assets/Stay.svg?react";
import FlightIcon from "../../assets/Flight.svg?react";
import TrainIcon from "../../assets/Bus.svg?react";
import BusIcon from "../../assets/Bus.svg?react";
import BoatIcon from "../../assets/Boat.svg?react";
import RentalIcon from "../../assets/Rental.svg?react";
import ResturantIcon from "../../assets/Restaurant.svg?react";
import EventIcon from "../../assets/Event.svg?react";
import CelebrationIcon from "../../assets/Celebration.svg?react";
import { theme } from "../../styles/theme";
import { useNavigate } from "react-router-dom";

type ThemeKeys = keyof typeof theme;

type PanelRoute = {
  icon: React.ReactNode;
  type: ThemeKeys;
  text: string;
  onClick: () => void;
};

const Panel = () => {
  const navigate = useNavigate();

  const panelActiviyRoutes: PanelRoute[] = [
    {
      icon: <StayIcon color={theme.base} />,
      type: "stay",
      text: "Stay",
      onClick: () => navigate("/stay-form"),
    },
    {
      icon: <FlightIcon color={theme.base} />,
      type: "flight",
      text: "Flight",
      onClick: () => navigate("/flight-form"),
    },
    {
      icon: <TrainIcon color={theme.base} />,
      type: "train",
      text: "Train",
      onClick: () => navigate("/train-form"),
    },
    {
      icon: <BusIcon color={theme.base} />,
      type: "bus",
      text: "Bus",
      onClick: () => navigate("/bus-form"),
    },
    {
      icon: <BoatIcon color={theme.base} />,
      type: "boat",
      text: "Boat",
      onClick: () => navigate("/boat-form"),
    },
    {
      icon: <RentalIcon color={theme.base} />,
      type: "rental",
      text: "Rental",
      onClick: () => navigate("/rental-form"),
    },
    {
      icon: <ResturantIcon color={theme.base} />,
      type: "restaurant",
      text: "Restaurant",
      onClick: () => navigate("/restaurant-form"),
    },
    {
      icon: <EventIcon color={theme.base} />,
      type: "event",
      text: "Event",
      onClick: () => navigate("/event-form"),
    },
    {
      icon: <CelebrationIcon color={theme.base} />,
      type: "celebration",
      text: "Celebration",
      onClick: () => navigate("/celebration-form"),
    },
  ];

  return (
    <PanelContainer>
      <PanelSection>
        <SectionHeader>Activites</SectionHeader>
        <SectionList>
          {panelActiviyRoutes.map((route) => {
            return (
              <MenuItem
                pictogram={
                  <Pictogram size="medium" type={route.type}>
                    {route.icon}
                  </Pictogram>
                }
                onClick={route.onClick}
                text={route.text}
              />
            );
          })}
        </SectionList>
      </PanelSection>
    </PanelContainer>
  );
};

export default Panel;
