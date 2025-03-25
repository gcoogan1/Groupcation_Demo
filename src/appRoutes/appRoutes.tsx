import FlightScreen from "../screens/Flight/FlightScreen";
import HomeScreen from "../screens/Home/HomeScreen";
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
];