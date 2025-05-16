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
} from "./BusActivity.styles";
import { avatarTheme, theme } from "@styles/theme";
import CollapaseButton from "../../../CollapaseButton/CollapaseButton";
import Button from "../../../Button/Button";
import Edit from "@assets/Edit.svg?react";
import BusIcon from "@assets/Bus.svg?react";
import Cost from "@assets/Cost.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import Attachments from "@assets/Attachments.svg?react";
import Notes from "@assets/AdditionalNotes.svg?react";
import BusCard from "./BusCard/BusCard";
import Pictogram from "../../../Pictogram/Pictogram";
import { BusAttachments } from "@tableTypes/busTable.types";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

export type BusActivityCardDetails = {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureLocation: string;
  durationTime: string;
  arrivalTime: string;
  arrivalLocation: string;
  travelers: Traveler[];
};

interface BusActivitysProps {
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
  attachments?: BusAttachments[];
  footerText: string;
  activityCardDetails: BusActivityCardDetails;
  isExpandedActivityId: string | null;
  toogleExpandedActivity: (id: string | null) => void;
}

const BusActivity: React.FC<BusActivitysProps> = ({
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
    departureLocation,
    durationTime,
    arrivalTime,
    arrivalLocation,
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
          <Pictogram type={"bus"}>
            <BusIcon color={theme.base} />
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
          <BusCard
            activityTitle={activityTitle}
            activitySubTitle={activitySubTitle}
            depatureTime={depatureTime}
            departureLocation={departureLocation}
            durationTime={durationTime}
            arrivalTime={arrivalTime}
            arrivalLocation={arrivalLocation}
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

export default BusActivity;
