import TrainActivity from "../../../components/Activites/TrainActivity/TrainActivity";
import {
  BoatItem,
  BusItem,
  EventItem,
  FlightItem,
  RentalItem,
  StayItem,
  TrainItem,
  TravelItem,
} from "../../../types/filter.types";
import {
  convertTableTraveler,
  createdByUserInfo,
  formatDateTimeForCard,
} from "../../../utils/conversionFunctions/conversionFunctions";
import {
  convertTimeToString,
  formatDateToDayMonthYear,
  getDurationInDaysHoursAndMinutes,
  getNumberOfNights,
} from "../../../utils/dateFunctions/dateFunctions";
import { UserTable } from "../../../types/userTable";
import FlightActivity from "../../../components/Activites/FlightActivity/FlightActivity";
import StayActivity from "../../../components/Activites/StayActivity/StayActivity";
import BusActivity from "../../../components/Activites/BusActivity/BusActivity";
import BoatActivity from "../../../components/Activites/BoatActivity/BoatActivity";
import RentalActivity from "../../../components/Activites/RentalActivity/RentalActivity";
import EventActivity from "../../../components/Activites/EventActivity/EventActivity";

export const activityRenderMap = {
  train: (
    item: TravelItem,
    users: UserTable[],
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "train") return null;

    const train = item as TrainItem;
    const travelers = train.travelers
      ? convertTableTraveler(train.travelers, users)
      : [];

    const duration = getDurationInDaysHoursAndMinutes(
      train.departureDate.toLocaleString(),
      train.departureTime,
      train.arrivalDate,
      train.arrivalTime
    );
    const createdBy = createdByUserInfo(train.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <TrainActivity
        onEditClick={() => handleEditClick("train", train.id)}
        cost={train?.cost}
        attachments={train.attachments}
        noteText={train.notes}
        onCostClick={() => handleOpenModal("cost", train)}
        onAttachmentClick={() => handleOpenModal("attachments", train)}
        onAddNotesClick={() => handleOpenModal("notes", train)}
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
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "flight") return null;

    const flight = item as FlightItem;

    const travelers = flight.travelers
      ? convertTableTraveler(flight.travelers, users)
      : [];
    const duration = getDurationInDaysHoursAndMinutes(
      flight.departureDate.toLocaleString(),
      flight.departureTime,
      flight.arrivalDate,
      flight.arrivalTime
    );
    const createdBy = createdByUserInfo(flight.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <FlightActivity
        onEditClick={() => handleEditClick("flight", flight.id)}
        cost={flight?.cost}
        attachments={flight.attachments}
        noteText={flight.notes}
        onCostClick={() => handleOpenModal("cost", flight)}
        onAttachmentClick={() => handleOpenModal("attachments", flight)}
        onAddNotesClick={() => handleOpenModal("notes", flight)}
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
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "stay") return null;
    const stay = item as StayItem;

    const travelers = stay.travelers
      ? convertTableTraveler(stay.travelers, users)
      : [];
    const duration = getNumberOfNights(stay.checkInDate, stay.checkOutDate);
    const createdBy = createdByUserInfo(stay.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <StayActivity
        onEditClick={() => handleEditClick("stay", stay.id)}
        cost={stay?.cost}
        attachments={stay.attachments}
        noteText={stay.notes}
        onCostClick={() => handleOpenModal("cost", stay)}
        onAttachmentClick={() => handleOpenModal("attachments", stay)}
        onAddNotesClick={() => handleOpenModal("notes", stay)}
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
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "bus") return null;

    const bus = item as BusItem;

    const travelers = bus.travelers
      ? convertTableTraveler(bus.travelers, users)
      : [];

    const duration = getDurationInDaysHoursAndMinutes(
      bus.departureDate.toLocaleString(),
      bus.departureTime,
      bus.arrivalDate,
      bus.arrivalTime
    );
    const createdBy = createdByUserInfo(bus.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <BusActivity
        onEditClick={() => handleEditClick("bus", bus.id)}
        cost={bus?.cost}
        attachments={bus.attachments}
        noteText={bus.notes}
        onCostClick={() => handleOpenModal("cost", bus)}
        onAttachmentClick={() => handleOpenModal("attachments", bus)}
        onAddNotesClick={() => handleOpenModal("notes", bus)}
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
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "boat") return null;

    const boat = item as BoatItem;

    const travelers = boat.travelers
      ? convertTableTraveler(boat.travelers, users)
      : [];

    const duration = getDurationInDaysHoursAndMinutes(
      boat.departureDate.toLocaleString(),
      boat.departureTime,
      boat.arrivalDate,
      boat.arrivalTime
    );
    const createdBy = createdByUserInfo(boat.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <BoatActivity
        onEditClick={() => handleEditClick("boat", boat.id)}
        cost={boat?.cost}
        attachments={boat.attachments}
        noteText={boat.notes}
        onCostClick={() => handleOpenModal("cost", boat)}
        onAttachmentClick={() => handleOpenModal("attachments", boat)}
        onAddNotesClick={() => handleOpenModal("notes", boat)}
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
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "rental") return null;

    const rental = item as RentalItem;

    const travelers = rental.travelers
      ? convertTableTraveler(rental.travelers, users)
      : [];

    const duration = getDurationInDaysHoursAndMinutes(
      rental.pickUpDate.toLocaleString(),
      rental.pickUpTime,
      rental.dropOffDate,
      rental.dropOffTime
    );

    const createdBy = createdByUserInfo(rental.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <RentalActivity
        onEditClick={() => handleEditClick("rental", rental.id)}
        cost={rental?.cost}
        attachments={rental.attachments}
        noteText={rental.notes}
        onCostClick={() => handleOpenModal("cost", rental)}
        onAttachmentClick={() => handleOpenModal("attachments", rental)}
        onAddNotesClick={() => handleOpenModal("notes", rental)}
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
          arrivalLocation: rental.dropOffLocation ? rental.dropOffLocation : 'Same as pick-up',
          travelers: travelers,
        }}
      />
    );
  },

  event: (
    item: TravelItem,
    users: UserTable[],
    handleOpenModal: (
      type: "cost" | "attachments" | "notes",
      item: TravelItem
    ) => void,
    handleEditClick: (type: string, id: string) => void
  ) => {
    if (item.type !== "event") return null;

    const event = item as EventItem;

    const travelers = event.travelers
      ? convertTableTraveler(event.travelers, users)
      : [];

    const duration = getDurationInDaysHoursAndMinutes(
      event.startDate.toLocaleString(),
      event.startTime,
      event.endDate,
      event.endTime
    );

    const createdBy = createdByUserInfo(event.createdBy, users);
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
    const footer = `${createdBy?.firstName} ${createdBy?.lastName} on ${createdAt}`;

    return (
      <EventActivity
        onEditClick={() => handleEditClick("event", event.id)}
        cost={event?.cost}
        attachments={event.attachments}
        noteText={event.notes}
        onCostClick={() => handleOpenModal("cost", event)}
        onAttachmentClick={() => handleOpenModal("attachments", event)}
        onAddNotesClick={() => handleOpenModal("notes", event)}
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
          arrivalLocation: '',
          travelers: travelers,
        }}
      />
    );
  },
};
