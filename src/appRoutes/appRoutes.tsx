import BoatScreen from "../screens/Boat/BoatScreen";
import BusScreen from "../screens/Bus/BusScreen";
import FlightScreen from "../screens/Flight/FlightScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import RentalScreen from "../screens/Rental/RentalScreen";
import StayScreen from "../screens/Stay/StayScreen";
import TrainScreen from "../screens/Train/TrainScreen";

type Route = {
  path: string;
  element: React.ReactNode;
};

export const ROUTES: Route[] = [
  {
    path: '/',
    element: <HomeScreen /> 
  },
  {
    path: '/train-form',
    element: <TrainScreen /> 
  },
  {
    path: '/train-form/:trainId',
    element: <TrainScreen /> 
  },
  {
    path: '/stay-form',
    element: <StayScreen /> 
  },
  {
    path: '/stay-form/:stayId',
    element: <StayScreen /> 
  },
  {
    path: '/flight-form',
    element: <FlightScreen /> 
  },
  {
    path: '/flight-form/:flightId',
    element: <FlightScreen /> 
  },
  {
    path: '/bus-form',
    element: <BusScreen /> 
  },
  {
    path: '/bus-form/:busId',
    element: <BusScreen /> 
  },
  {
    path: '/boat-form',
    element: <BoatScreen /> 
  },
  {
    path: '/boat-form/:boatId',
    element: <BoatScreen /> 
  },
  {
    path: '/rental-form',
    element: <RentalScreen /> 
  },
  {
    path: '/rental-form/:rentalId',
    element: <RentalScreen /> 
  },
];