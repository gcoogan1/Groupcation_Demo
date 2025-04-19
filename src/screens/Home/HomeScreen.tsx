// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchGroupcationTable } from "../../store/thunk/groupcationThunk";
import { fetchTrainByGroupcationId } from "../../modules/activities/train/thunk/trainThunk";
import {
  ActionButtonsContainer,
  ActionFilterChipsContainer,
  ActionFilterLabel,
  ActionFilterLabelContainer,
  ActionFilters,
  BodyContainer,
  BodyContentContainer,
  ButtonWrapper,
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
  FilterChipContainer,
  FilterHeader,
  FilterHeaderText,
  FilterItineraryButton,
  Filters,
  FiltersModalContainer,
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
  PanelOverlay,
  PanelWrapper,
  ScreenContainer,
  Title,
  TopContainer,
} from "./HomeScreen.styles";
import SwissFlag from "../../assets/Switzerland.svg?react";
import {
  formatDateToDayMonthYear,
  getDaysRemaining,
  getInBetweenDates,
} from "../../utils/dateFunctions/dateFunctions";
import ChevronDown from "../../assets/Chevron_Down.svg?react";
import ChevronUp from "../../assets/Chevron_Up.svg?react";
import { theme } from "../../styles/theme";
import {
  selectBoats,
  selectBuses,
  selectConvertedUsersForFilters,
  selectFlights,
  selectGroupcationById,
  selectRentals,
  selectStays,
  selectTableUsers,
  selectTrains,
} from "../../store/selectors/selectors";
import {
  ACTIVITY_OPTIONS,
  GroupcationDate,
  TravelItem,
} from "../../types/filter.types";
import Button from "../../components/Button/Button";
import FilterItem from "../../components/FilterItem/FilterItem";
import Pictogram from "../../components/Pictogram/Pictogram";
import Avatar from "../../components/Avatar/Avatar";
import Add from "../../assets/Add.svg?react";
import DateBefore from "../../assets/Date_Before.svg?react";
import DateAfter from "../../assets/Date_After.svg?react";
import { groupTravelItemsByDate } from "../../utils/conversionFunctions/conversionFunctions";
import { filterGroups } from "../../utils/filterFunctions/filterFunctions";
import { getRenderableDays } from "../../utils/filterFunctions/renderableDays";
import { activityRenderMap } from "./RenderedActivity/RenderedActivity";
import { useNavigate } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import CloseButton from "../../components/CloseButton/CloseButton";
import FilterChip from "../../components/FilterChip/FilterChip";
import FilterIcon from "../../assets/Filter.svg?react";
import FilterModal from "../../components/FiltersModal/FiltersModal";
import { fetchAllGroupcationData } from "../../store/thunk/fetchAllThunk";
import Modal from "../../components/Modal/Modal";

//TODO: NEED TO GRAB ALL FORMS TO UPDATE STATE CORRECTLY
//TODO: ADD TRAVELERS/ATTACHMENTS TO EACH GET TABLE BY ID

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const activityContentRef = useRef<HTMLDivElement>(null);
  const travelersContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [activitiesExpanded, setActivitesExpanded] = useState(false);
  const [travelersExpanded, setTravelersExpanded] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTravelers, setSelectedTravelers] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<{
    open: boolean;
    type: "cost" | "attachments" | "notes" | null;
  }>({ open: false, type: null });
  const [openPanel, setOpenPanel] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TravelItem | null>(null);

  useEffect(() => {
    if (!openPanel) return;

    const handleResize = () => {
      setOpenPanel(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [openPanel]);

  useEffect(() => {
    dispatch(fetchAllGroupcationData(333));
  }, [dispatch]);

  // HELPER FUNCTIONS

  const handleOpenModal = (
    type: "cost" | "attachments" | "notes",
    item: TravelItem
  ) => {
    setSelectedItem(item);
    setOpenModal({ open: true, type });
  };

  const handleCloseModal = () => {
    setOpenModal({ open: false, type: null });
    setSelectedItem(null);
  };

  const handleTogglePanel = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: buttonRect.bottom + window.scrollY, // Position the modal just below the button
        left: buttonRect.left + window.scrollX - 136, // Align with the button
      });
    }
    setOpenPanel((prev) => !prev);
  };

  const handleOpenFilterModal = () => {
    if (openPanel) {
      setOpenPanel(false);
    }
    setOpenFilterModal(true);
    return;
  };

  const handleCloseFilterModal = () => {
    setSelectedActivities([]);
    setSelectedTravelers([]);
    setOpenFilterModal(false);
    // if (activitiesExpanded) setActivitesExpanded(false)
    // if (travelersExpanded) setTravelersExpanded(false)
    return;
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

  const handleEditCardClick = (type: string, id: string) => {
    const path = `/${type}-form/${id}`;
    return navigate(path);
  };

  // FILTER FUNCTIONS
  const toggleActivityExpand = () => {
    setActivitesExpanded((prev) => !prev);
  };

  const toggleTravelersExpand = () => {
    setTravelersExpanded((prev) => !prev);
  };

  // SELECTOR FUNCTIONS
  const groupcation = useSelector((state: RootState) =>
    selectGroupcationById(state, 333)
  );

  const filterTravelerList = useSelector((state: RootState) =>
    selectConvertedUsersForFilters(state)
  );

  const trains = useSelector(selectTrains);
  const flights = useSelector(selectFlights);
  const stays = useSelector(selectStays);
  const buses = useSelector(selectBuses);
  const boats = useSelector(selectBoats);
  const rentals = useSelector(selectRentals);
  const users = useSelector(selectTableUsers);

  // ITINIARY DISPLAY FUNCTIONS
  const grouped = useMemo(
    () => groupTravelItemsByDate(rentals, boats, buses, stays, flights, trains, groupcation),
    [rentals, boats, buses, stays, flights, trains, groupcation]
  );

  const filteredGrouped = useMemo(
    () => filterGroups(grouped, selectedActivities, selectedTravelers),
    [grouped, selectedActivities, selectedTravelers]
  );

  const groupcationFullDates: GroupcationDate[] =
    groupcation &&
    getInBetweenDates(groupcation?.startDate, groupcation?.endDate);

  const renderableDays = getRenderableDays(
    filteredGrouped,
    groupcationFullDates
  );

  const remainingDays =
    groupcation?.startDate && getDaysRemaining(groupcation?.startDate);

  const filterChipTravelers =
    selectedTravelers.length > 1
      ? `${selectedTravelers.length} Travelers`
      : `${selectedTravelers.length} Traveler`;

  const filterChipActivities =
    selectedActivities.length > 1
      ? `${selectedActivities.length} Activities`
      : `${selectedActivities.length} Activity`;

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
                  <ActionFilterLabel>
                    {selectedTravelers.length > 0 ||
                    selectedActivities.length > 0
                      ? "Showing:"
                      : "Showing All"}
                  </ActionFilterLabel>
                </ActionFilterLabelContainer>
                <FilterChipContainer>
                  {selectedTravelers.length > 0 && (
                    <FilterChip
                      filterText={filterChipTravelers}
                      onClick={() => setSelectedTravelers([])}
                    />
                  )}
                  {selectedActivities.length > 0 && (
                    <FilterChip
                      filterText={filterChipActivities}
                      onClick={() => setSelectedActivities([])}
                    />
                  )}
                </FilterChipContainer>
                <ActionFilterChipsContainer></ActionFilterChipsContainer>
              </ActionFilters>
              <ActionButtonsContainer>
                <FilterItineraryButton>
                  <Button
                    color={"secondary"}
                    ariaLabel={"Filter Itinerary"}
                    leftIcon={<FilterIcon color={theme.secondary} />}
                    onClick={handleOpenFilterModal}
                    styles={{ width: "100%" }}
                  >
                    Filter Itinerary
                  </Button>
                </FilterItineraryButton>
                <Button
                  buttonRef={buttonRef}
                  color={"primary"}
                  ariaLabel={"Add new"}
                  leftIcon={<Add color={theme.base} />}
                  onClick={handleTogglePanel}
                >
                  Add New
                </Button>
              </ActionButtonsContainer>
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
                              {activityRenderMap[item.type]?.(
                                item,
                                users,
                                handleOpenModal,
                                handleEditCardClick
                              )}
                            </>
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
      {openModal.open && selectedItem && (
        <Modal
          openModal={openModal}
          onClose={handleCloseModal}
          cost={selectedItem?.cost}
          attachments={selectedItem.attachments}
          notes={selectedItem?.notes}
        />
      )}
      {openPanel && (
        <PanelOverlay>
          <PanelWrapper
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            <ButtonWrapper>
              <CloseButton onClose={() => setOpenPanel(false)} />
            </ButtonWrapper>
            <Panel />
          </PanelWrapper>
        </PanelOverlay>
      )}
      {openFilterModal && (
        <FilterModal
          openModal={openFilterModal}
          onClose={handleCloseFilterModal}
          onConfirm={() => setOpenFilterModal(false)}
        >
          <FiltersModalContainer>
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
          </FiltersModalContainer>
        </FilterModal>
      )}
    </ScreenContainer>
  );
};

export default HomeScreen;
