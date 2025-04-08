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
import Modal from "../../../components/Modal/Modal";

export const activityRenderMap = {
  train: (
    item: TravelItem,
    users: UserTable[],
    openModal: { open: boolean; type: string | null },
    handleOpenModal: (type: "cost" | "attachments" | "notes") => void,
    handleCloseModal: () => void,
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
          onCostClick={() => handleOpenModal("cost")}
          onAttachmentClick={() => handleOpenModal("attachments")}
          onAddNotesClick={() => handleOpenModal("notes")}
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
        <Modal
          openModal={openModal}
          onClose={handleCloseModal}
          cost={train.cost}
          attachments={train.attachments}
          notes={train.notes}
        />
      </>
    );
  },

  flight: (item: TravelItem) => {
    if (item.type !== "flight") return null;
    const flight = item as FlightItem;

    return (
      // <FlightActivity
      //   onEditClick={() => console.log("EDIT")}
      //   cost={flight.cost}
      //   onCostClick={() => console.log("COST")}
      //   onAttachmentClick={() => console.log("ATTACHMENTS")}
      //   onAddNotesClick={() => console.log("ADD NOTES")}
      //   hightlightedActivityAction="Flight to"
      //   activityText={`${flight.departureAirport} → ${flight.arrivalAirport}`}
      //   departureTime={flight.departureTime}
      //   footerText="Departs at"
      //   activityCardDetails={{
      //     activityTitle: "Flight",
      //     activitySubTitle: `${flight.departureAirport} to ${flight.arrivalAirport}`,
      //     depatureTime: flight.departureTime,
      //     departureLocation: flight.departureAirport,
      //     durationTime: flight.durationTime,
      //     arrivalTime: flight.arrivalTime,
      //     arrivalLocation: flight.arrivalAirport,
      //     travelers: flight.travelers || [],
      //   }}
      // />
      <h1>hi</h1>
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
