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
} from "./RestaurantActivity.styles";
import { avatarTheme, theme } from "@styles/theme";
import CollapaseButton from "../../../CollapaseButton/CollapaseButton";
import Button from "../../../Button/Button";
import Edit from "@assets/Edit.svg?react";
import RestaurantIcon from "@assets/Restaurant.svg?react";
import Cost from "@assets/Cost.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import Attachments from "@assets/Attachments.svg?react";
import Notes from "@assets/AdditionalNotes.svg?react";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import Pictogram from "../../../Pictogram/Pictogram";
import { RestaurantAttachments } from "@tableTypes/restaurantTable.types";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

export type RestaurantActivityCardDetails = {
  activityTitle: string;
  activitySubTitle?: string;
  reservationTime: string;
  restaurantLocation: string;
  travelers: Traveler[];
};

interface RestaurantActivitysProps {
  onEditClick: () => void;
  cost?: string;
  id: string;
  onCostClick: () => void;
  onAttachmentClick: () => void;
  onAddNotesClick: () => void;
  noteText?: string;
  hightlightedActivityAction: string;
  activityText: string;
  reservationTime: string;
  attachments?: RestaurantAttachments[];
  footerText: string;
  activityCardDetails: RestaurantActivityCardDetails;
  onTravelersClick: () => void;
  isExpandedActivityId: string | null;
  toogleExpandedActivity: (id: string | null) => void;
}

const RestaurantActivity: React.FC<RestaurantActivitysProps> = ({
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
  reservationTime,
  footerText,
  activityCardDetails,
  isExpandedActivityId,
  toogleExpandedActivity,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const { activityTitle, activitySubTitle, restaurantLocation, travelers } =
    activityCardDetails;

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
          <Pictogram type={"restaurant"}>
            <RestaurantIcon color={theme.base} />
          </Pictogram>
          <div>
            <ActivityText>
              <ActivityHighlightText>
                {hightlightedActivityAction}{" "}
              </ActivityHighlightText>
              {activityText}
            </ActivityText>
            <DepartureText>{reservationTime}</DepartureText>
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
          <RestaurantCard
            activityTitle={activityTitle}
            activitySubTitle={activitySubTitle}
            reservationTime={activityCardDetails.reservationTime}
            restaurantLocation={restaurantLocation}
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

export default RestaurantActivity;
