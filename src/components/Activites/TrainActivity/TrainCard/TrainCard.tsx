import { avatarTheme, theme } from "../../../../styles/theme";
import AvatarStack from "../../../AvatarStack/AvatarStack";
import Users from "../../../../assets/Users.svg?react";
import Duration from "../../../../assets/Duration.svg?react"
import { CardContainer, CardTitle, CardSubTitle, CardContents, ContentDetails, StartEndDetails, DetailsContainer, DetailsTitle, DetailsText, TimeText, LocationText, DurationDetails, Graphics, GraphicsLine, DurationText, ContentFooter, FooterTextContainer, FooterTitle, FooterText, CardHeader } from "./TrainCard.styles";



type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface TrainCardProps {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureLocation: string;
  durationTime: string;
  arrivalTime: string;
  arrivalLocation: string;
  travelers: Traveler[] | [];
}

const TrainCard: React.FC<TrainCardProps> = ({
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

export default TrainCard