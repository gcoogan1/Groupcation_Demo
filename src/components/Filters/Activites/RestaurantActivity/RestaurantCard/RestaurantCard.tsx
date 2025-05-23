import { avatarTheme, theme } from "@styles/theme";
import AvatarStack from "../../../../AvatarStack/AvatarStack";
import Users from "@assets/Users.svg?react";
import {
  CardContainer,
  CardTitle,
  CardSubTitle,
  CardContents,
  ContentDetails,
  StartEndDetails,
  DetailsContainer,
  DetailsTitle,
  DetailsText,
  TimeText,
  LocationText,
  ContentFooter,
  FooterTextContainer,
  FooterTitle,
  FooterText,
  CardHeader,
} from "./RestaurantCard.styles";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface RestaurantCardProps {
  activityTitle: string;
  activitySubTitle?: string;
  reservationTime: string;
  restaurantLocation: string;
  travelers: Traveler[] | [];
  onTravelersClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  activityTitle,
  activitySubTitle,
  reservationTime,
  restaurantLocation,
  travelers,
  onTravelersClick,
}) => {
  const additionalCount = travelers.length - 1;
  const additionalTravelers =
    additionalCount === 1
      ? "and 1 other"
      : additionalCount > 1
      ? `and ${additionalCount} others`
      : "";

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{activityTitle}</CardTitle>
        <CardSubTitle>{activitySubTitle}</CardSubTitle>
      </CardHeader>
      <CardContents>
        <ContentDetails>
          <StartEndDetails>
            <DetailsContainer>
              <DetailsTitle>Reserved for</DetailsTitle>
            </DetailsContainer>
            <DetailsText>
              <TimeText>{reservationTime}</TimeText>
              <LocationText>{restaurantLocation}</LocationText>
            </DetailsText>
          </StartEndDetails>
        </ContentDetails>
        <ContentFooter>
          <FooterTextContainer>
            <Users
              style={{ width: "20px", height: "20px" }}
              color={theme.iconText}
            />
            <div>
              <FooterTitle>Travelers</FooterTitle>
              <FooterText>You {additionalTravelers}</FooterText>
            </div>
          </FooterTextContainer>
          <AvatarStack onClick={onTravelersClick} travelers={travelers} />
        </ContentFooter>
      </CardContents>
    </CardContainer>
  );
};

export default RestaurantCard;
