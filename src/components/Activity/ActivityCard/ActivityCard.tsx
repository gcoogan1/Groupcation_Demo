import { avatarTheme, theme } from "../../../styles/theme";
import { CardContainer, CardContents, CardHeader, CardSubTitle, CardTitle, ContentDetails, ContentFooter, DetailsContainer, DetailsText, DetailsTitle, DurationDetails, DurationText, FooterText, FooterTextContainer, FooterTitle, Graphics, GraphicsLine, LocationText, StartEndDetails, TimeText } from "./ActivityCard.styles";
import Duration from "../../../assets/Duration.svg?react"
import Users from "../../../assets/Users.svg?react";
import AvatarStack from "../../AvatarStack/AvatarStack";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface ActivityCardProps {
  activityTitle: string;
  activitySubTitle: string;
  depatureTime: string;
  departureLocation: string;
  durationTime: string;
  arrivalTime: string;
  arrivalLocation: string;
  travelers: Traveler[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activityTitle,
  activitySubTitle,
  depatureTime,
  departureLocation,
  durationTime,
  arrivalTime,
  arrivalLocation,
  travelers
}) => {
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
              <DetailsTitle>Departs at</DetailsTitle>
              <DetailsText>
                <TimeText>{depatureTime}</TimeText>
                <LocationText>{departureLocation}</LocationText>
              </DetailsText>
            </DetailsContainer>
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
              <DetailsTitle>Arrives at</DetailsTitle>
              <DetailsText>
                <TimeText>{arrivalTime}</TimeText>
                <LocationText>{arrivalLocation}</LocationText>
              </DetailsText>
            </DetailsContainer>
          </StartEndDetails>
        </ContentDetails>
        <ContentFooter>
            <FooterTextContainer>
            <Users style={{ width: '20px', height: '20px' }} color={theme.iconText} />
              <div>
              <FooterTitle>Travelers</FooterTitle>
              <FooterText>You and {travelers.length - 1} others</FooterText>
              </div>
            </FooterTextContainer>
          <AvatarStack travelers={travelers} />
        </ContentFooter>
      </CardContents>
    </CardContainer>
  )
}

export default ActivityCard