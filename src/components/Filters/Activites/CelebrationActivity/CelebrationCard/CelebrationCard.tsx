import { avatarTheme, theme } from "@styles/theme";
import AvatarStack from "../../../../AvatarStack/AvatarStack";
import Users from "@assets/Users.svg?react";
import Duration from "@assets/Duration.svg?react";
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
  DurationDetails,
  Graphics,
  GraphicsLine,
  DurationText,
  ContentFooter,
  FooterTextContainer,
  FooterTitle,
  FooterText,
  CardHeader,
} from "./CelebrationCard.styles";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface CelebrationCardProps {
  activityTitle: string;
  activitySubTitle?: string;
  startCardTime: string;
  celebrationLocation: string;
  durationTime: string;
  endCardTime: string;
  travelers: Traveler[] | [];
  onTravelersClick: () => void;
}

const CelebrationCard: React.FC<CelebrationCardProps> = ({
  activityTitle,
  activitySubTitle,
  startCardTime,
  celebrationLocation,
  durationTime,
  endCardTime,
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
              <DetailsTitle>Starts at</DetailsTitle>
            </DetailsContainer>
            <DetailsText>
              <TimeText>{startCardTime}</TimeText>
              <LocationText>{celebrationLocation}</LocationText>
            </DetailsText>
          </StartEndDetails>
          <DurationDetails>
            <Graphics>
              <GraphicsLine />
              <Duration color={theme.iconText} />
              <GraphicsLine />
            </Graphics>
            <DurationText>{durationTime}</DurationText>
          </DurationDetails>
          <StartEndDetails>
            <DetailsContainer>
              <DetailsTitle>Ends at</DetailsTitle>
            </DetailsContainer>
            <DetailsText>
              <TimeText>{endCardTime}</TimeText>
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

export default CelebrationCard;
