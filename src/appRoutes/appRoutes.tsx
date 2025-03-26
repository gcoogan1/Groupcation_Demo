import BoatScreen from "../screens/Boat/BoatScreen";
import BusScreen from "../screens/Bus/BusScreen";
import DrivingScreen from "../screens/Driving/DrivingScreen";
import EventScreen from "../screens/Event/EventScreen";
import FlightScreen from "../screens/Flight/FlightScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import LinkedTripScreen from "../screens/LinkedTrip/LinkedTrip";
import NoteScreen from "../screens/Note/NoteScreen";
import RentalScreen from "../screens/Rental/RentalScreen";
import RestaurantScreen from "../screens/Restaurant/RestaurantScreen";
import StayScreen from "../screens/Stay/StayScreen";
import TrainScreen from "../screens/Train/TrainScreen";
import WalkingScreen from "../screens/Walking/WalkingScreen";

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
  {
    path: '/restaurant-form',
    element: <RestaurantScreen /> 
  },
  {
    path: '/restaurant-form/:restaurantId',
    element: <RestaurantScreen /> 
  },
  {
    path: '/event-form',
    element: <EventScreen /> 
  },
  {
    path: '/event-form/:eventId',
    element: <EventScreen /> 
  },
  {
    path: '/walking-form',
    element: <WalkingScreen /> 
  },
  {
    path: '/walking-form/:walkingId',
    element: <WalkingScreen /> 
  },
  {
    path: '/driving-form',
    element: <DrivingScreen /> 
  },
  {
    path: '/driving-form/:drivingId',
    element: <DrivingScreen /> 
  },
  {
    path: '/note-form',
    element: <NoteScreen /> 
  },
  {
    path: '/note-form/:noteId',
    element: <NoteScreen /> 
  },
  {
    path: '/linked-trip-form',
    element: <LinkedTripScreen /> 
  },
  {
    path: '/linked-trip-form/:linkedTripId',
    element: <LinkedTripScreen /> 
  },
];