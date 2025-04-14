import React, { useEffect, useRef, useState } from "react";
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
import { avatarTheme, theme } from "../../../styles/theme";
import CollapaseButton from "../../CollapaseButton/CollapaseButton";
import Button from "../../Button/Button";
import Edit from "../../../assets/Edit.svg?react";
import FlightIcon from "../../../assets/Flight.svg?react";
import Cost from "../../../assets/Cost.svg?react";
import ChevRight from "../../../assets/Chevron_Right.svg?react";
import Attachments from "../../../assets/Attachments.svg?react";
import Notes from "../../../assets/AdditionalNotes.svg?react";

import Pictogram from "../../Pictogram/Pictogram";
import { FlightAttachments } from "../../../types/flightTable.types";
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
  onCostClick: () => void;
  onAttachmentClick: () => void;
  onAddNotesClick: () => void;
  noteText?: string;
  hightlightedActivityAction: string;
  activityText: string;
  departureTime: string;
  attachments?: FlightAttachments[];
  footerText: string;
  activityCardDetails: FlightActivityCardDetails;
}

const FlightActivity: React.FC<FlightActivitysProps> = ({
  onEditClick,
  cost,
  onCostClick,
  attachments,
  onAttachmentClick,
  onAddNotesClick,
  noteText,
  hightlightedActivityAction,
  activityText,
  departureTime,
  footerText,
  activityCardDetails,
}) => {
  const [expanded, setExpanded] = useState(false);
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


  useEffect(() => {
    if (!expanded) return;
    const handleResize = () => {
      setExpanded(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [expanded]);

  const toggleExpand = () => {
    if (expanded) return;
    if (contentRef.current) {
      const newHeight = expanded ? "0" : `${contentRef.current.scrollHeight}px`;
      contentRef.current.style.height = newHeight;
      setExpanded((prev) => !prev);
    }
  };

  return (
    <ActivityContainer
      isExpanded={expanded}
      onClick={toggleExpand}
      style={{ flexDirection: "column" }}
    >
      <ActivityItem isExpanded={expanded}>
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
          {expanded && (
            <CollapaseButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setExpanded(false);
              }}
            />
          )}
        </CollapseButtonContainer>
      </ActivityItem>

      <ExpandableContent
        isExpanded={expanded}
        ref={contentRef}
        style={{ maxHeight: expanded ? contentRef.current?.scrollHeight : 0 }}
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
                  <LinkText>{noteText ? noteText : "Add notes"}</LinkText>
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
