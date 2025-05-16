import React, { useRef } from "react";
import {
  ContentContainer,
  ExpandableContent,
  ActivityContainer,
  ActivityFooter,
  ActivityFooterContent,
  ActivityFooterTitle,
  ActivityHighlightText,
  ActivityItem,
  ActivityItemContent,
  ActivityText,
  DepartureText,
  SecondaryContent,
  LinkContent,
  LinkTextTitle,
  LinkText,
  ChevIcon,
  SecondaryDivider,
  SecondaryLink,
  LinkTextContainer,
  CollapseButtonContainer,
} from "./FlightActivity.styles";
import { avatarTheme, theme } from "@styles/theme";
import CollapaseButton from "../../../CollapaseButton/CollapaseButton";
import Button from "../../../Button/Button";
import Edit from "@assets/Edit.svg?react";
import FlightIcon from "@assets/Flight.svg?react";
import Cost from "@assets/Cost.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import Attachments from "@assets/Attachments.svg?react";
import Notes from "@assets/AdditionalNotes.svg?react";

import Pictogram from "../../../Pictogram/Pictogram";
import { FlightAttachments } from "@tableTypes/flightTable.types";
import FlightCard from "./FlightCard/FlightCard";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

export type FlightActivityCardDetails = {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureAirport: string;
  durationTime: string;
  arrivalTime: string;
  arrivalAirport: string;
  travelers: Traveler[];
};

interface FlightActivitysProps {
  onEditClick: () => void;
  cost?: string;
  id: string;
  onCostClick: () => void;
  onAttachmentClick: () => void;
  onAddNotesClick: () => void;
  onTravelersClick: () => void;
  noteText?: string;
  hightlightedActivityAction: string;
  activityText: string;
  departureTime: string;
  attachments?: FlightAttachments[];
  footerText: string;
  activityCardDetails: FlightActivityCardDetails;
  isExpandedActivityId: string | null;
  toogleExpandedActivity: (id: string | null) => void;
}

const FlightActivity: React.FC<FlightActivitysProps> = ({
  onEditClick,
  cost,
  id,
  onCostClick,
  attachments,
  onAttachmentClick,
  onAddNotesClick,
  onTravelersClick,
  noteText,
  hightlightedActivityAction,
  activityText,
  departureTime,
  footerText,
  activityCardDetails,
  isExpandedActivityId,
  toogleExpandedActivity
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    activityTitle,
    activitySubTitle,
    depatureTime,
    departureAirport,
    durationTime,
    arrivalTime,
    arrivalAirport,
    travelers,
  } = activityCardDetails;

  const isExpanded = isExpandedActivityId === id;

  const toggleExpand = () => {
    if (isExpanded) return;
    if (contentRef.current) {
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      toogleExpandedActivity(id);
    }
  };

  return (
    <ActivityContainer
      isExpanded={isExpanded}
      onClick={toggleExpand}
      style={{ flexDirection: "column" }}
    >
      <ActivityItem isExpanded={isExpanded}>
        <ActivityItemContent>
          <Pictogram type={"flight"}>
            <FlightIcon color={theme.base} />
          </Pictogram>
          <div>
            <ActivityText>
              <ActivityHighlightText>
                {hightlightedActivityAction}{" "}
              </ActivityHighlightText>
              {activityText}
            </ActivityText>
            <DepartureText>{departureTime}</DepartureText>
          </div>
        </ActivityItemContent>
        <CollapseButtonContainer>
          {isExpanded && (
            <CollapaseButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                toogleExpandedActivity(null);
              }}
            />
          )}
        </CollapseButtonContainer>
      </ActivityItem>

      <ExpandableContent
        isExpanded={isExpanded}
        ref={contentRef}
        style={{ maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0 }}
      >
        <ContentContainer>
          <FlightCard
            activityTitle={activityTitle}
            activitySubTitle={activitySubTitle}
            depatureTime={depatureTime}
            departureAirport={departureAirport}
            durationTime={durationTime}
            arrivalTime={arrivalTime}
            arrivalAirport={arrivalAirport}
            travelers={travelers}
            onTravelersClick={onTravelersClick}
            
          />
          <SecondaryContent>
            <SecondaryLink onClick={onCostClick}>
              <LinkContent>
                <Cost color={theme.iconText} />
                <LinkTextContainer>
                  <LinkTextTitle>Cost</LinkTextTitle>
                  <LinkText>
                    {cost ? `$${cost} USD per travelers` : "Add cost"}
                  </LinkText>
                </LinkTextContainer>
              </LinkContent>
              <ChevIcon>
                <ChevRight color={theme.iconText} />
              </ChevIcon>
            </SecondaryLink>
            <SecondaryDivider />
            <SecondaryLink onClick={onAttachmentClick}>
              <LinkContent>
                <Attachments color={theme.iconText} />
                <LinkTextContainer>
                  <LinkTextTitle>Attachments</LinkTextTitle>
                  <LinkText>
                    {attachments
                      ? `${attachments.length} files`
                      : "Add attachments"}
                  </LinkText>
                </LinkTextContainer>
              </LinkContent>
              <ChevIcon>
                <ChevRight color={theme.iconText} />
              </ChevIcon>
            </SecondaryLink>
            <SecondaryDivider />
            <SecondaryLink onClick={onAddNotesClick}>
              <LinkContent>
                <Notes color={theme.iconText} />
                <LinkTextContainer>
                  <LinkTextTitle>Additional Notes</LinkTextTitle>
                  <LinkText style={{ whiteSpace: 'pre-wrap' }}>{noteText ? noteText : "Add notes"}</LinkText>
                </LinkTextContainer>
              </LinkContent>
              <ChevIcon>
                <ChevRight color={theme.iconText} />
              </ChevIcon>
            </SecondaryLink>
          </SecondaryContent>
        </ContentContainer>
        <ActivityFooter>
          <div>
            <ActivityFooterTitle>Added By</ActivityFooterTitle>
            <ActivityFooterContent>{footerText}</ActivityFooterContent>
          </div>
          <Button
            leftIcon={<Edit color={theme.secondary} />}
            color={"outlined"}
            ariaLabel={"edit"}
            onClick={onEditClick}
          >
            Edit
          </Button>
        </ActivityFooter>
      </ExpandableContent>
    </ActivityContainer>
  );
};

export default FlightActivity;
