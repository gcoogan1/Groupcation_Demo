import { avatarTheme, theme } from "@styles/theme";
import AvatarStack from "../../../../AvatarStack/AvatarStack";
import Users from "@assets/Users.svg?react";
import Duration from "@assets/Duration.svg?react"
import { CardContainer, CardTitle, CardSubTitle, CardContents, ContentDetails, StartEndDetails, DetailsContainer, DetailsTitle, DetailsText, TimeText, LocationText, DurationDetails, Graphics, GraphicsLine, DurationText, ContentFooter, FooterTextContainer, FooterTitle, FooterText, CardHeader } from "./FlightCard.styles";


type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface FlightCardProps {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureAirport: string;
  durationTime: string;
  arrivalTime: string;
  arrivalAirport: string;
  travelers: Traveler[] | [];
  onTravelersClick: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({
  activityTitle,
  activitySubTitle,
  depatureTime,
  departureAirport,
  durationTime,
  arrivalTime,
  arrivalAirport,
  travelers,
  onTravelersClick
}) => {

  const additionalTravelers = (travelers.length > 1) ? `and ${travelers.length - 1} others` : ''

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
              <DetailsTitle>Takes-off at</DetailsTitle>
            </DetailsContainer>
              <DetailsText>
                <TimeText>{depatureTime}</TimeText>
                <LocationText>{departureAirport}</LocationText>
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
              <DetailsTitle>Lands at</DetailsTitle>
            </DetailsContainer>
              <DetailsText>
                <TimeText>{arrivalTime}</TimeText>
                <LocationText>{arrivalAirport}</LocationText>
              </DetailsText>
          </StartEndDetails>
        </ContentDetails>
        <ContentFooter onClick={onTravelersClick}>
            <FooterTextContainer>
            <Users style={{ width: '20px', height: '20px' }} color={theme.iconText} />
              <div>
              <FooterTitle>Travelers</FooterTitle>
              <FooterText>You {additionalTravelers}</FooterText>
              </div>
            </FooterTextContainer>
          <AvatarStack travelers={travelers} />
        </ContentFooter>
      </CardContents>
    </CardContainer>
  )
}

export default FlightCard