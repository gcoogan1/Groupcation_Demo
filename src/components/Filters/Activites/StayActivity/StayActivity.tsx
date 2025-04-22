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
} from "./StayActivity.styles";
import { avatarTheme, theme } from "@styles/theme";
import CollapaseButton from "../../../CollapaseButton/CollapaseButton";
import Button from "../../../Button/Button";
import Edit from "@assets/Edit.svg?react";
import StayIcon from "@assets/Stay.svg?react";
import Cost from "@assets/Cost.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import Attachments from "@assets/Attachments.svg?react";
import Notes from "@assets/AdditionalNotes.svg?react";
import Pictogram from "../../../Pictogram/Pictogram";
import { StayAttachments } from "@tableTypes/stayTable.types";
import StayCard from "./StayCard/StayCard";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

export type StayActivityCardDetails = {
  activityTitle: string;
  activitySubTitle?: string;
  placeAddress: string;
  checkInDateTime: string;
  durationTime: string;
  checkOutDateTime: string;
  travelers: Traveler[];
};

interface StayActivitysProps {
  onEditClick: () => void;
  cost?: string;
  onCostClick: () => void;
  onAttachmentClick: () => void;
  onAddNotesClick: () => void;
  noteText?: string;
  hightlightedActivityAction: string;
  activityText: string;
  checkInTime: string;
  attachments?: StayAttachments[];
  footerText: string;
  activityCardDetails: StayActivityCardDetails;
}

const TrainActivity: React.FC<StayActivitysProps> = ({
  onEditClick,
  cost,
  onCostClick,
  attachments,
  onAttachmentClick,
  onAddNotesClick,
  noteText,
  hightlightedActivityAction,
  activityText,
  checkInTime,
  footerText,
  activityCardDetails,
}) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    activityTitle,
    activitySubTitle,
    checkInDateTime,
    placeAddress,
    durationTime,
    checkOutDateTime,
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
          <Pictogram type={"stay"}>
            <StayIcon color={theme.base} />
          </Pictogram>
          <div>
            <ActivityText>
              <ActivityHighlightText>
                {hightlightedActivityAction}{" "}
              </ActivityHighlightText>
              {activityText}
            </ActivityText>
            <DepartureText>{checkInTime}</DepartureText>
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
          <StayCard
            activityTitle={activityTitle}
            activitySubTitle={activitySubTitle}
            checkInTime={checkInDateTime}
            placeAddress={placeAddress}
            durationTime={durationTime}
            checkOutTime={checkOutDateTime}
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

export default TrainActivity;
