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
} from "./RentalActivity.styles";
import { avatarTheme, theme } from "@styles/theme";
import CollapaseButton from "../../../CollapaseButton/CollapaseButton";
import Button from "../../../Button/Button";
import Edit from "@assets/Edit.svg?react";
import RentalIcon from "@assets/Rental.svg?react";
import Cost from "@assets/Cost.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import Attachments from "@assets/Attachments.svg?react";
import Notes from "@assets/AdditionalNotes.svg?react";
import RentalCard from "./RentalCard/RentalCard";
import Pictogram from "../../../Pictogram/Pictogram";
import { RentalAttachments } from "@tableTypes/rentalTable.types";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

export type RentalActivityCardDetails = {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureLocation: string;
  durationTime: string;
  arrivalTime: string;
  arrivalLocation: string;
  travelers: Traveler[];
};

interface RentalActivitysProps {
  onEditClick: () => void;
  cost?: string;
  extendedId: string;
  onCostClick: () => void;
  onAttachmentClick: () => void;
  onAddNotesClick: () => void;
  onTravelersClick: () => void;
  noteText?: string;
  hightlightedActivityAction: string;
  activityText: string;
  departureTime: string;
  attachments?: RentalAttachments[];
  footerText: string;
  activityCardDetails: RentalActivityCardDetails;
  isExpandedActivityId: string | null;
  toogleExpandedActivity: (id: string | null) => void;
}

const RentalActivity: React.FC<RentalActivitysProps> = ({
  onEditClick,
  cost,
  extendedId,
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

  const isExpanded = isExpandedActivityId === extendedId;

  const toggleExpand = () => {
    if (isExpanded) return;
    if (contentRef.current) {
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      toogleExpandedActivity(extendedId);
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
          <Pictogram type={"rental"}>
            <RentalIcon color={theme.base} />
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
          <RentalCard
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

export default RentalActivity;
