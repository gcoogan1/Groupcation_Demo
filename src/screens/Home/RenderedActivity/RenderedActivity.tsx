import TrainActivity from "../../../components/Activites/TrainActivity/TrainActivity";
import {
  FlightItem,
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
  getDurationInHoursAndMinutes,
} from "../../../utils/dateFunctions/dateFunctions";
import { UserTable } from "../../../types/userTable";
import FlightActivity from "../../../components/Activites/FlightActivity/FlightActivity";

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
    const duration = getDurationInHoursAndMinutes(
      train.departureTime,
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
      <>
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
      </>
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
    const duration = getDurationInHoursAndMinutes(
      flight.departureTime,
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

  stay: (item: TravelItem) => {
    if (item.type !== "stay") return null;
    const stay = item as StayItem;

    return (
      // <StayActivity
      //   onEditClick={() => console.log("EDIT")}
      //   cost={stay.cost}
      //   onCostClick={() => console.log("COST")}
      //   onAttachmentClick={() => console.log("ATTACHMENTS")}
      //   onAddNotesClick={() => console.log("ADD NOTES")}
      //   hightlightedActivityAction="Staying at"
      //   activityText={`${stay.hotelName}`}
      //   departureTime={stay.checkInTime}
      //   footerText="Check-in"
      //   activityCardDetails={{
      //     activityTitle: stay.hotelName,
      //     activitySubTitle: stay.address,
      //     depatureTime: stay.checkInTime,
      //     departureLocation: stay.city,
      //     durationTime: stay.duration,
      //     arrivalTime: stay.checkOutTime,
      //     arrivalLocation: stay.city,
      //     travelers: stay.travelers || [],
      //   }}
      <h1>there</h1>
      // />
    );
  },
};
