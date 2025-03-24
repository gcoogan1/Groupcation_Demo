import HomeScreen from "../screens/Home/HomeScreen";
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
];