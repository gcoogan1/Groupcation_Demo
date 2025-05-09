import TrainActivity from "@components/Filters/Activites/TrainActivity/TrainActivity";
import {
  BoatItem,
  BusItem,
  CelebrationItem,
  DrivingRouteItem,
  EventItem,
  FlightItem,
  LinkedTripItem,
  NoteItem,
  RentalItem,
  RestaurantItem,
  StayItem,
  TrainItem,
  TravelerUIInfo,
  TravelItem,
  WalkingRouteItem,
} from "@tableTypes/filter.types";
import {
  convertTableTraveler,
  createdByUserInfo,
  formatDateTimeForCard,
} from "@utils/conversionFunctions/conversionFunctions";
import {
  convertTimeToString,
  formatDateToDayMonthYear,
  getDurationInDaysHoursAndMinutes,
  getNumberOfNights,
} from "@utils/dateFunctions/dateFunctions";
import { UserTable } from "@tableTypes/userTable";
import FlightActivity from "@components/Filters/Activites/FlightActivity/FlightActivity";
import StayActivity from "@components/Filters/Activites/StayActivity/StayActivity";
import BusActivity from "@components/Filters/Activites/BusActivity/BusActivity";
import BoatActivity from "@components/Filters/Activites/BoatActivity/BoatActivity";
import RentalActivity from "@components/Filters/Activites/RentalActivity/RentalActivity";
import EventActivity from "@components/Filters/Activites/EventActivity/EventActivity";
import RestaurantActivity from "@components/Filters/Activites/RestaurantActivity/RestaurantActivity";
import CelebrationActivity from "@components/Filters/Activites/CelebrationActivity/CelebrationActivity";
import ActivityRoute from "@/components/Route/Route";
import Note from "@/components/Note/Note";
import LinkedTrip from "@/components/LinkedTrip/LinkedTrip";

export const activityRenderMap = {
  train: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal?: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "train") return null;

    const train = item as TrainItem;

    // Get creator info
    const createdBy = createdByUserInfo(train.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = train.travelers
      ? convertTableTraveler(train.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      train.departureDate.toLocaleString(),
      train.departureTime,
      train.arrivalDate,
      train.arrivalTime
    );
    const createdAt = formatDateToDayMonthYear(train.createdAt);
    const departureTime = convertTimeToString(train.departureTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      train.departureTime,
      train.departureDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      train.arrivalTime,
      train.arrivalDate
    );
    const extendedId = `train${train.id}`;
    const footer = `${createdBy.firstName} ${createdBy.lastName} on ${createdAt}`;

    return (
      <TrainActivity
        onEditClick={() => handleEditClick?.("train", train.id)}
        cost={train?.cost}
        attachments={train.attachments}
        noteText={train.notes}
        onCostClick={() => handleOpenModal?.("cost", train)}
        onAttachmentClick={() => handleOpenModal?.("attachments", train)}
        onAddNotesClick={() => handleOpenModal?.("notes", train)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", train, travelers)
        }
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        id={extendedId}
        hightlightedActivityAction="Train"
        activityText={`from ${train.departureStation} to ${train.arrivalStation}`}
        departureTime={`Leaves at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: train.railwayLine,
          activitySubTitle: `${train.class} Class`,
          depatureTime: cardDepartureDateTime,
          departureLocation: train.departureStation,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalLocation: train.arrivalStation,
          travelers: travelers,
        }}
      />
    );
  },

  flight: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "flight") return null;

    const flight = item as FlightItem;

    // Get creator info
    const createdBy = createdByUserInfo(flight.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = flight.travelers
      ? convertTableTraveler(flight.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      flight.departureDate.toLocaleString(),
      flight.departureTime,
      flight.arrivalDate,
      flight.arrivalTime
    );
    const createdAt = formatDateToDayMonthYear(flight.createdAt);
    const departureTime = convertTimeToString(flight.departureTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      flight.departureTime,
      flight.departureDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      flight.arrivalTime,
      flight.arrivalDate
    );
    const extendedId = `flight${flight.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <FlightActivity
        onEditClick={() => handleEditClick("flight", flight.id)}
        cost={flight?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={flight.attachments}
        noteText={flight.notes}
        onCostClick={() => handleOpenModal("cost", flight)}
        onAttachmentClick={() => handleOpenModal("attachments", flight)}
        onAddNotesClick={() => handleOpenModal("notes", flight)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", flight, travelers)
        }
        hightlightedActivityAction="Flight"
        activityText={`from ${flight.departureAirport} to ${flight.arrivalAirport}`}
        departureTime={`Leaves at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: flight.airline,
          activitySubTitle: `${flight.flightClass} Class`,
          depatureTime: cardDepartureDateTime,
          departureAirport: flight.departureAirport,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalAirport: flight.arrivalAirport,
          travelers: travelers,
        }}
      />
    );
  },

  stay: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "stay") return null;
    const stay = item as StayItem;

    // Get creator info
    const createdBy = createdByUserInfo(stay.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = stay.travelers
      ? convertTableTraveler(stay.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getNumberOfNights(stay.checkInDate, stay.checkOutDate);
    const createdAt = formatDateToDayMonthYear(stay.createdAt);
    const checkInTime = convertTimeToString(stay.checkInTime);
    const cardCheckInDateTime = formatDateTimeForCard(
      stay.checkInTime,
      stay.checkInDate
    );
    const cardCheckOutDateTime = formatDateTimeForCard(
      stay.checkOutTime,
      stay.checkOutDate
    );
    const extendedId = `stay${stay.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <StayActivity
        onEditClick={() => handleEditClick("stay", stay.id)}
        cost={stay?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={stay.attachments}
        noteText={stay.notes}
        onCostClick={() => handleOpenModal("cost", stay)}
        onAttachmentClick={() => handleOpenModal("attachments", stay)}
        onAddNotesClick={() => handleOpenModal("notes", stay)}
        onTravelersClick={() => handleOpenModal?.("travelers", stay, travelers)}
        hightlightedActivityAction="Stay in"
        activityText={`${stay.placeName}`}
        checkInTime={`Check-in at ${checkInTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: stay.placeName,
          checkInDateTime: cardCheckInDateTime,
          placeAddress: stay.placeAddress,
          durationTime:
            duration > 1 ? `${duration} nights` : `${duration} night`,
          checkOutDateTime: cardCheckOutDateTime,
          travelers: travelers,
        }}
      />
    );
  },

  bus: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "bus") return null;

    const bus = item as BusItem;

    // Get creator info
    const createdBy = createdByUserInfo(bus.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = bus.travelers
      ? convertTableTraveler(bus.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];
  
    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];;

    const duration = getDurationInDaysHoursAndMinutes(
      bus.departureDate.toLocaleString(),
      bus.departureTime,
      bus.arrivalDate,
      bus.arrivalTime
    );
    const createdAt = formatDateToDayMonthYear(bus.createdAt);
    const departureTime = convertTimeToString(bus.departureTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      bus.departureTime,
      bus.departureDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      bus.arrivalTime,
      bus.arrivalDate
    );
    const extendedId = `bus${bus.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <BusActivity
        onEditClick={() => handleEditClick("bus", bus.id)}
        cost={bus?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={bus.attachments}
        noteText={bus.notes}
        onCostClick={() => handleOpenModal("cost", bus)}
        onAttachmentClick={() => handleOpenModal("attachments", bus)}
        onAddNotesClick={() => handleOpenModal("notes", bus)}
        onTravelersClick={() => handleOpenModal?.("travelers", bus, travelers)}
        hightlightedActivityAction="Bus"
        activityText={`from ${bus.departureBusStop} to ${bus.arrivalBusStop}`}
        departureTime={`Leaves at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: bus.busRoute,
          activitySubTitle: `${bus.busClass} Class`,
          depatureTime: cardDepartureDateTime,
          departureLocation: bus.departureBusStop,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalLocation: bus.arrivalBusStop,
          travelers: travelers,
        }}
      />
    );
  },

  boat: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "boat") return null;

    const boat = item as BoatItem;

    // Get creator info
    const createdBy = createdByUserInfo(boat.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = boat.travelers
      ? convertTableTraveler(boat.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      boat.departureDate.toLocaleString(),
      boat.departureTime,
      boat.arrivalDate,
      boat.arrivalTime
    );
    const createdAt = formatDateToDayMonthYear(boat.createdAt);
    const departureTime = convertTimeToString(boat.departureTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      boat.departureTime,
      boat.departureDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      boat.arrivalTime,
      boat.arrivalDate
    );
    const extendedId = `boat${boat.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <BoatActivity
        onEditClick={() => handleEditClick("boat", boat.id)}
        cost={boat?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={boat.attachments}
        noteText={boat.notes}
        onCostClick={() => handleOpenModal("cost", boat)}
        onAttachmentClick={() => handleOpenModal("attachments", boat)}
        onAddNotesClick={() => handleOpenModal("notes", boat)}
        onTravelersClick={() => handleOpenModal?.("travelers", boat, travelers)}
        hightlightedActivityAction="Boat"
        activityText={`from ${boat.departureDock} to ${boat.arrivalDock}`}
        departureTime={`Leaves at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: boat.boatCruiseLine,
          activitySubTitle: `${boat.boatCruiseClass} Class`,
          depatureTime: cardDepartureDateTime,
          departureLocation: boat.departureDock,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalLocation: boat.arrivalDock,
          travelers: travelers,
        }}
      />
    );
  },

  rental: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "rental") return null;

    const rental = item as RentalItem;

    // Get creator info
    const createdBy = createdByUserInfo(rental.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = rental.travelers
      ? convertTableTraveler(rental.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      rental.pickUpDate.toLocaleString(),
      rental.pickUpTime,
      rental.dropOffDate,
      rental.dropOffTime
    );
    const createdAt = formatDateToDayMonthYear(rental.createdAt);
    const departureTime = convertTimeToString(rental.pickUpTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      rental.pickUpTime,
      rental.pickUpDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      rental.dropOffTime,
      rental.dropOffDate
    );
    const extendedId = `rental${rental.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <RentalActivity
        onEditClick={() => handleEditClick("rental", rental.id)}
        cost={rental?.cost}
        extendedId={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={rental.attachments}
        noteText={rental.notes}
        onCostClick={() => handleOpenModal("cost", rental)}
        onAttachmentClick={() => handleOpenModal("attachments", rental)}
        onAddNotesClick={() => handleOpenModal("notes", rental)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", rental, travelers)
        }
        hightlightedActivityAction="Rental"
        activityText={`from ${rental.pickUpLocation}`}
        departureTime={`Pick up at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: rental.rentalAgency,
          activitySubTitle: `${rental.carType}`,
          depatureTime: cardDepartureDateTime,
          departureLocation: rental.pickUpLocation,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalLocation: rental.dropOffLocation
            ? rental.dropOffLocation
            : "Same as pick-up",
          travelers: travelers,
        }}
      />
    );
  },

  event: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "event") return null;

    const event = item as EventItem;

    // Get creator info
    const createdBy = createdByUserInfo(event.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = event.travelers
      ? convertTableTraveler(event.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      event.startDate.toLocaleString(),
      event.startTime,
      event.endDate,
      event.endTime
    );
    const createdAt = formatDateToDayMonthYear(event.createdAt);
    const departureTime = convertTimeToString(event.startTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      event.startTime,
      event.startDate
    );
    const cardArrivalDateTime = formatDateTimeForCard(
      event.endTime,
      event.endDate
    );
    const extendedId = `event${event.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <EventActivity
        onEditClick={() => handleEditClick("event", event.id)}
        cost={event?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={event.attachments}
        noteText={event.notes}
        onCostClick={() => handleOpenModal("cost", event)}
        onAttachmentClick={() => handleOpenModal("attachments", event)}
        onAddNotesClick={() => handleOpenModal("notes", event)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", event, travelers)
        }
        hightlightedActivityAction=""
        activityText={`${event.eventName}`}
        departureTime={`Starts at ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: event.eventOrganizer,
          activitySubTitle: `${event.ticketType}`,
          depatureTime: cardDepartureDateTime,
          departureLocation: event.eventLocation,
          durationTime: duration,
          arrivalTime: cardArrivalDateTime,
          arrivalLocation: "",
          travelers: travelers,
        }}
      />
    );
  },

  restaurant: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "restaurant") return null;

    const restaurant = item as RestaurantItem;

    // Get creator info
    const createdBy = createdByUserInfo(restaurant.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = restaurant.travelers
      ? convertTableTraveler(restaurant.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];
  
    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const createdAt = formatDateToDayMonthYear(restaurant.createdAt);
    const departureTime = convertTimeToString(restaurant.reservationTime);
    const cardDepartureDateTime = formatDateTimeForCard(
      restaurant.reservationTime,
      restaurant.reservationTime
    );
    const extendedId = `restaurant${restaurant.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <RestaurantActivity
        onEditClick={() => handleEditClick("restaurant", restaurant.id)}
        cost={restaurant?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={restaurant.attachments}
        noteText={restaurant.notes}
        onCostClick={() => handleOpenModal("cost", restaurant)}
        onAttachmentClick={() => handleOpenModal("attachments", restaurant)}
        onAddNotesClick={() => handleOpenModal("notes", restaurant)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", restaurant, travelers)
        }
        hightlightedActivityAction=""
        activityText={`${restaurant.restaurantName}`}
        reservationTime={`Reservation for ${departureTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: restaurant.restaurantName,
          activitySubTitle: `${restaurant.tableType}`,
          reservationTime: cardDepartureDateTime,
          restaurantLocation: restaurant.restaurantAddress,
          travelers: travelers,
        }}
      />
    );
  },

  celebration: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void,
    toogleExpandedActivity: (id: string) => void,
    expandedActivityId: string | null,
    handleOpenModal: (
      type: "cost" | "attachments" | "notes" | "travelers",
      item: TravelItem,
      travelers?: TravelerUIInfo[]
    ) => void
  ) => {
    if (item.type !== "celebration") return null;

    const celebration = item as CelebrationItem;

    // Get creator info
    const createdBy = createdByUserInfo(celebration.createdBy, users);
    const creatorInfo = {
      travelerId: createdBy.id,
      travelerFullName: `${createdBy.firstName} ${createdBy.lastName}`,
    };
    const creatorAsTraveler = convertTableTraveler([creatorInfo], users);

    // Convert and filter existing travelers
    const existingTravelers = celebration.travelers
      ? convertTableTraveler(celebration.travelers, users).filter(
          (traveler) => traveler.travelerId !== createdBy.id
        )
      : [];

    // Combine without duplicates
    const travelers = [...existingTravelers, ...creatorAsTraveler];

    const duration = getDurationInDaysHoursAndMinutes(
      celebration.startDate.toLocaleString(),
      celebration.startTime,
      celebration.endDate,
      celebration.endTime
    );
    const createdAt = formatDateToDayMonthYear(celebration.createdAt);
    const startTime = convertTimeToString(celebration.startTime);
    const cardStartDateTime = formatDateTimeForCard(
      celebration.startTime,
      celebration.startDate
    );
    const cardEndDateTime = formatDateTimeForCard(
      celebration.endTime,
      celebration.endDate
    );
    const extendedId = `celebration${celebration.id}`;
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <CelebrationActivity
        onEditClick={() => handleEditClick("celebration", celebration.id)}
        cost={celebration?.cost}
        id={extendedId}
        isExpandedActivityId={expandedActivityId}
        toogleExpandedActivity={() => toogleExpandedActivity(extendedId)}
        attachments={celebration.attachments}
        noteText={celebration.notes}
        onCostClick={() => handleOpenModal("cost", celebration)}
        onAttachmentClick={() => handleOpenModal("attachments", celebration)}
        onAddNotesClick={() => handleOpenModal("notes", celebration)}
        onTravelersClick={() =>
          handleOpenModal?.("travelers", celebration, travelers)
        }
        hightlightedActivityAction="Celebration"
        activityText={`${celebration.celebrationName}`}
        startTime={`Starts at ${startTime}`}
        footerText={footer}
        activityCardDetails={{
          activityTitle: celebration.celebrationName,
          activitySubTitle: `${celebration.celebrationType}`,
          startCardTime: cardStartDateTime,
          celebrationLocation: celebration.celebrationLocation,
          durationTime: duration,
          endCardTime: cardEndDateTime,
          travelers: travelers,
        }}
      />
    );
  },

  drivingRoute: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "drivingRoute") return null;

    const drivingRoute = item as DrivingRouteItem;
    const duration = `${drivingRoute.driveDuration} to ${drivingRoute.arrivalLocation}`;
    const createdBy = createdByUserInfo(drivingRoute.createdBy, users);
    const createdAt = formatDateToDayMonthYear(drivingRoute.createdAt);

    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <ActivityRoute
        onEditClick={() => handleEditClick("driving", drivingRoute.id)}
        hightlightedRouteAction={"Driving"}
        routeText={duration}
        notesText={drivingRoute?.notes}
        footerText={footer}
        type="drivingRoute"
      />
    );
  },

  walkingRoute: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "walkingRoute") return null;

    const walkingRoute = item as WalkingRouteItem;
    const duration = `${walkingRoute.walkDuration} to ${walkingRoute.arrivalLocation}`;
    const createdBy = createdByUserInfo(walkingRoute.createdBy, users);
    const createdAt = formatDateToDayMonthYear(walkingRoute.createdAt);

    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <ActivityRoute
        onEditClick={() => handleEditClick("walking", walkingRoute.id)}
        hightlightedRouteAction={"Walking"}
        routeText={duration}
        notesText={walkingRoute?.notes}
        footerText={footer}
        type="walkingRoute"
      />
    );
  },

  note: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "note") return null;

    const note = item as NoteItem;
    const createdBy = createdByUserInfo(note.createdBy, users);
    const createdAt = formatDateToDayMonthYear(note.createdAt);

    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <Note
        onEditClick={() => handleEditClick("note", note.id)}
        hightlightedNoteAction={"Note"}
        noteText={note.noteTitle}
        extendedNotesTitle={note.noteTitle}
        extendedNoteText={note.noteContent}
        footerText={footer}
      />
    );
  },

  linkedTrip: (
    item: TravelItem,
    users: UserTable[],
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "linkedTrip") return null;

    const linkedTrip = item as LinkedTripItem;

    const duration = `${formatDateToDayMonthYear(
      linkedTrip.startDate
    )} to ${formatDateToDayMonthYear(linkedTrip.endDate)}`;

    const travelers = linkedTrip.travelers
      ? convertTableTraveler(linkedTrip.travelers, users)
      : [];
      
    const backgroundUrl = linkedTrip.attachments?.[0]?.fileUrl;

    return (
      <LinkedTrip
        tripName={linkedTrip.linkedTripTitle}
        duration={duration}
        travelers={travelers}
        backgroundImg={backgroundUrl}
        onEditClick={() => handleEditClick("linked-trip", linkedTrip.id)}
      />
    );
  },
};
