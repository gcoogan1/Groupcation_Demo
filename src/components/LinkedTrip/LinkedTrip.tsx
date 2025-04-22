import { avatarTheme } from "@styles/theme";
import AvatarStack from "../AvatarStack/AvatarStack";
import {
	AvatarStackWrapper,
	LinkedTripContainer,
	LinkedTripDuration,
	LinkedTripName,
	LinkedTripTextContainer,
} from "./LinkedTrip.styles";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
	initials: string;
	color: AvatarThemeKeys;
};

interface LinkedTripProps {
	tripName: string;
	duration: string;
	travelers: Traveler[];
	backgroundImg: string;
}

const LinkedTrip: React.FC<LinkedTripProps> = ({
	tripName,
	duration,
	travelers,
	backgroundImg,
}) => {
	return (
		<LinkedTripContainer background={backgroundImg}>
			<LinkedTripTextContainer>
				<LinkedTripName>{tripName}</LinkedTripName>
				<LinkedTripDuration>{duration}</LinkedTripDuration>
			</LinkedTripTextContainer>
			<AvatarStackWrapper>
				<AvatarStack travelers={travelers} />
			</AvatarStackWrapper>
		</LinkedTripContainer>
	);
};

export default LinkedTrip;
