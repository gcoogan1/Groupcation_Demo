import { avatarTheme, theme } from "@styles/theme";
import AvatarStack from "../../../AvatarStack/AvatarStack";
import Users from "@assets/Users.svg?react";
import Duration from "@assets/Duration.svg?react"
import { CardContainer, CardTitle, CardSubTitle, CardContents, ContentDetails, StartEndDetails, DetailsContainer, DetailsTitle, DetailsText, TimeText, LocationText, DurationDetails, Graphics, GraphicsLine, DurationText, ContentFooter, FooterTextContainer, FooterTitle, FooterText, CardHeader } from "./BusCard.styles";



type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface BusCardProps {
  activityTitle: string;
  activitySubTitle?: string;
  depatureTime: string;
  departureLocation: string;
  durationTime: string;
  arrivalTime: string;
  arrivalLocation: string;
  travelers: Traveler[] | [];
}

const BusCard: React.FC<BusCardProps> = ({
  activityTitle,
  activitySubTitle,
  depatureTime,
  departureLocation,
  durationTime,
  arrivalTime,
  arrivalLocation,
  travelers
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
              <DetailsTitle>Leaves at</DetailsTitle>
            </DetailsContainer>
              <DetailsText>
                <TimeText>{depatureTime}</TimeText>
                <LocationText>{departureLocation}</LocationText>
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
              <DetailsTitle>Reaches at</DetailsTitle>
            </DetailsContainer>
              <DetailsText>
                <TimeText>{arrivalTime}</TimeText>
                <LocationText>{arrivalLocation}</LocationText>
              </DetailsText>
          </StartEndDetails>
        </ContentDetails>
        <ContentFooter>
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

export default BusCard