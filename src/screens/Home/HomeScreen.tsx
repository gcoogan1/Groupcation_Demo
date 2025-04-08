// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
// import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGroupcationTable } from "../../store/thunk/groupcationThunk";
import { fetchTrainByGroupcationId } from "../../modules/activities/train/thunk/trainThunk";
// import { fetchUsersTable } from "../../store/thunk/usersThunk";
// import { convertUsersToTravelers } from "../../utils/conversionFunctions/conversionFunctions";
// import { selectFlights, selectGroupcationById, selectTrains } from "../../store/selectors/selectors";
// import { fetchFlightByGroupcationId } from "../../modules/activities/flights/thunk/flightThunk";
import {
  ActionFilterChipsContainer,
  ActionFilterLabel,
  ActionFilterLabelContainer,
  ActionFilters,
  BodyContainer,
  BodyContentContainer,
  Day,
  DayList,
  DayNumber,
  DaysContainer,
  DestinationContainer,
  DestinationIcon,
  DestinationText,
  EmptyText,
  Filter,
  FilterBody,
  FilterHeader,
  FilterHeaderText,
  Filters,
  Footer,
  FooterText,
  HeaderContent,
  HeaderCover,
  HeaderDates,
  HeaderDateSeperator,
  HeaderDateText,
  HeaderDestinations,
  HeaderDetails,
  ItineraryActions,
  ItineraryContainer,
  ListDate,
  ListDateContent,
  ListDay,
  ListItemsContainer,
  ListItemsEmpty,
  NumberContainer,
  NumberLine,
  NumberText,
  ScreenContainer,
  Title,
  TopContainer,
} from "./HomeScreen.styles";
import SwissFlag from "../../assets/Switzerland.svg?react";
import {
  formatDateToDayMonthYear,
  getDaysRemaining,
  getDurationInHoursAndMinutes,
  getInBetweenDates,
} from "../../utils/dateFunctions/dateFunctions";
import ChevronDown from "../../assets/Chevron_Down.svg?react";
import ChevronUp from "../../assets/Chevron_Up.svg?react";
import { theme } from "../../styles/theme";
import {
  selectConvertedUsers,
  selectConvertedUsersForFilters,
  selectFlights,
  selectGroupcationById,
  selectStays,
  selectTableUsers,
  selectTrains,
} from "../../store/selectors/selectors";
import { ACTIVITY_OPTIONS, GroupcationDate } from "../../types/filter.types";
import Button from "../../components/Button/Button";
import FilterItem from "../../components/FilterItem/FilterItem";
import Pictogram from "../../components/Pictogram/Pictogram";
import Avatar from "../../components/Avatar/Avatar";
import Add from "../../assets/Add.svg?react";
import DateBefore from "../../assets/Date_Before.svg?react";
import DateAfter from "../../assets/Date_After.svg?react";
import { groupTravelItemsByDate } from "../../utils/conversionFunctions/conversionFunctions";
import {
  filterGroups
} from "../../utils/filterFunctions/filterFunctions";
import { fetchFlightByGroupcationId } from "../../modules/activities/flights/thunk/flightThunk";
import { fetchUsersTable } from "../../store/thunk/usersThunk";
import { getRenderableDays } from "../../utils/filterFunctions/renderableDays";
import { fetchStayByGroupcationId } from "../../modules/activities/stay/thunk/stayThunk";
import { activityRenderMap } from "./RenderedActivity/RenderedActivity";
import { useNavigate } from "react-router-dom";

//TODO: NEED TO GRAB ALL FORMS TO UPDATE STATE CORRECTLY
//TODO: ADD TRAVELERS/ATTACHMENTS TO EACH GET TABLE BY ID

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const activityContentRef = useRef<HTMLDivElement>(null);
  const travelersContentRef = useRef<HTMLDivElement>(null);

  const [activitiesExpanded, setActivitesExpanded] = useState(false);
  const [travelersExpanded, setTravelersExpanded] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTravelers, setSelectedTravelers] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<{
    open: boolean;
    type: "cost" | "attachments" | "notes" | null;
  }>({ open: false, type: null });
  
  const handleOpenModal = (type: "cost" | "attachments" | "notes") => {
    setOpenModal({ open: true, type });
  };
  
  const handleCloseModal = () => {
    setOpenModal({ open: false, type: null });
  };

  const handleActivityToggle = useCallback(
    (value: string, isSelected: boolean) => {
      setSelectedActivities((prev) => {
        // Prevent duplicates
        // If already selected then just return prev, otherwise add value
        if (isSelected) {
          return prev.includes(value) ? prev : [...prev, value];
        } else {
          return prev.filter((item) => item !== value);
        }
      });
    },
    []
  );

  const handleTravelerToggle = useCallback(
    (value: string, isSelected: boolean) => {
      setSelectedTravelers((prev) => {
        // Prevent duplicates
        // If already selected then just return prev, otherwise add value
        if (isSelected) {
          return prev.includes(value) ? prev : [...prev, value];
        } else {
          return prev.filter((item) => item !== value);
        }
      });
    },
    []
  );

  const handleEditCardClick = (type:string, id: string) => {
    const path = `/${type}-form/${id}`
    console.log("path:", path)
    return navigate(path)
  }

  const toggleActivityExpand = () => {
    if (activityContentRef.current) {
      setActivitesExpanded((prev) => !prev);
    }
  };

  const toggleTravelersExpand = () => {
    if (travelersContentRef.current) {
      setTravelersExpanded((prev) => !prev);
    }
  };

  useEffect(() => {
    dispatch(fetchGroupcationTable(333));
    dispatch(fetchTrainByGroupcationId(333));
    dispatch(fetchFlightByGroupcationId(333));
    dispatch(fetchStayByGroupcationId(333));
    dispatch(fetchUsersTable());
  }, [dispatch]);

  const groupcation = useSelector((state: RootState) =>
    selectGroupcationById(state, 333)
  );

  const filterTravelerList = useSelector((state: RootState) =>
    selectConvertedUsersForFilters(state)
  );

  const remainingDays =
    groupcation?.startDate && getDaysRemaining(groupcation?.startDate);
  const trains = useSelector(selectTrains);
  const flights = useSelector(selectFlights);
  const stays = useSelector(selectStays);
  const users = useSelector(selectTableUsers)

  const grouped = groupTravelItemsByDate(stays, flights, trains, groupcation);
  const filteredGrouped = filterGroups(
    grouped,
    selectedActivities,
    selectedTravelers
  );
  const groupcationFullDates: GroupcationDate[] =
    groupcation &&
    getInBetweenDates(groupcation?.startDate, groupcation?.endDate);

  const renderableDays = getRenderableDays(
    filteredGrouped,
    groupcationFullDates
  );

  console.log("GROUPED", grouped);
  console.log("FILTERED GROUP:", filteredGrouped);
  // console.log("GROUPCATION:", groupcation)

  // console.log("GROUPCATION DATES:", groupcationFullDates);

  // console.log("TRAINS", trains);
  // console.log("selected", selectedActivities);
  // console.log(selectedActivities.includes("trains"));
  // console.log(selectedTravelers)

  return (
    <ScreenContainer>
      <TopContainer>
        <HeaderCover>
          <HeaderContent>
            <Title>{groupcation?.groupcationTitle}</Title>
            <HeaderDetails>
              <HeaderDates>
                <HeaderDateText>
                  {formatDateToDayMonthYear(groupcation?.startDate)} to{" "}
                  {formatDateToDayMonthYear(groupcation?.endDate)}
                </HeaderDateText>
                <HeaderDateSeperator>•</HeaderDateSeperator>
                <HeaderDateText>Starts in {remainingDays} days</HeaderDateText>
              </HeaderDates>
              <HeaderDestinations>
                {groupcation?.destinations.map((destination) => {
                  return (
                    <DestinationContainer key={destination}>
                      <DestinationIcon>
                        <SwissFlag />
                      </DestinationIcon>
                      <DestinationText>{destination}</DestinationText>
                    </DestinationContainer>
                  );
                })}
              </HeaderDestinations>
            </HeaderDetails>
          </HeaderContent>
        </HeaderCover>
      </TopContainer>
      <BodyContainer>
        <BodyContentContainer>
          <Filters>
            <Filter>
              <FilterHeader onClick={toggleActivityExpand}>
                <FilterHeaderText>Activities</FilterHeaderText>
                {activitiesExpanded ? (
                  <ChevronDown color={theme.iconText} />
                ) : (
                  <ChevronUp color={theme.iconText} />
                )}
              </FilterHeader>
              <FilterBody
                ref={activityContentRef}
                style={{ display: activitiesExpanded ? "flex" : "none" }}
              >
                {ACTIVITY_OPTIONS.map((activity) => (
                  <FilterItem
                    key={activity.value}
                    action={activity.action}
                    icon={
                      <Pictogram type={activity.value}>
                        {activity.icon}
                      </Pictogram>
                    }
                    label={activity.label}
                    value={activity.value}
                    selected={selectedActivities.includes(activity.value)}
                    onToggle={handleActivityToggle}
                  />
                ))}
              </FilterBody>
            </Filter>
            <Filter>
              <FilterHeader onClick={toggleTravelersExpand}>
                <FilterHeaderText>Travelers</FilterHeaderText>
                {travelersExpanded ? (
                  <ChevronDown color={theme.iconText} />
                ) : (
                  <ChevronUp color={theme.iconText} />
                )}
              </FilterHeader>
              <FilterBody
                ref={travelersContentRef}
                style={{ display: travelersExpanded ? "flex" : "none" }}
              >
                {filterTravelerList?.map((traveler) => {
                  const stringVal = traveler.value.toString();
                  return (
                    <FilterItem
                      action={"checkbox"}
                      icon={
                        <Avatar
                          initials={traveler.initials}
                          color={traveler.color}
                        />
                      }
                      label={traveler.label}
                      value={stringVal}
                      selected={selectedTravelers.includes(stringVal)}
                      onToggle={handleTravelerToggle}
                    />
                  );
                })}
              </FilterBody>
            </Filter>
          </Filters>
          <ItineraryContainer>
            <ItineraryActions>
              <ActionFilters>
                <ActionFilterLabelContainer>
                  <ActionFilterLabel>Showing:</ActionFilterLabel>
                </ActionFilterLabelContainer>
                <ActionFilterChipsContainer></ActionFilterChipsContainer>
                <Button
                  color={"primary"}
                  ariaLabel={"Add new"}
                  leftIcon={<Add color={theme.base} />}
                  onClick={() => console.log("clicked")}
                >
                  Add New
                </Button>
              </ActionFilters>
            </ItineraryActions>
            <DaysContainer>
              {renderableDays.map((day) => (
                <Day key={day.date}>
                  <DayNumber>
                    <NumberContainer period={day.period}>
                      {day.period === "during" ? (
                        <NumberText>{day.dayNumber}</NumberText>
                      ) : (
                        <>
                          {day.period === "before" ? (
                            <DateBefore color={theme.iconText} />
                          ) : (
                            <DateAfter color={theme.iconText} />
                          )}
                        </>
                      )}
                    </NumberContainer>
                    <NumberLine period={day.period} />
                  </DayNumber>
                  <DayList>
                    <ListDateContent>
                      <ListDate>{day.date}</ListDate>
                      <ListDay>{day.dow}</ListDay>
                    </ListDateContent>
                    {day.items.length > 0 ? (
                      <ListItemsContainer>
                        {day.items.map((item) => {

                          return (
                            <>
                              {activityRenderMap[item.type]?.(item, users, openModal, handleOpenModal, handleCloseModal, handleEditCardClick)}
                            </>
                            // <>
                            //   {item.type === "train" && (
                            //     <TrainActivity
                            //       onEditClick={() => console.log("EDIT")}
                            //       cost={item?.cost}
                            //       onCostClick={() => console.log("COST")}
                            //       onAttachmentClick={() => console.log("ATTACHMENTS")}
                            //       onAddNotesClick={() => console.log("ADD NOTES")}
                            //       hightlightedActivityAction={item.type}
                            //       activityText={"from to"}
                            //       departureTime={item?.departureTime}
                            //       footerText={"Departs at"}
                            //       activityCardDetails={activityCard}
                            //     />
                            //   )}
                            // </>
                          );
                        })}
                      </ListItemsContainer>
                    ) : (
                      <ListItemsContainer>
                        <ListItemsEmpty>
                          <EmptyText>No Activity Added</EmptyText>
                        </ListItemsEmpty>
                      </ListItemsContainer>
                    )}
                  </DayList>
                </Day>
              ))}
            </DaysContainer>
          </ItineraryContainer>
        </BodyContentContainer>
      </BodyContainer>
      <Footer>
        <FooterText>Custom Trip Created in Groupcation</FooterText>
      </Footer>
    </ScreenContainer>
  );
};

export default HomeScreen;
