import { avatarTheme } from "@styles/theme";
import AvatarStack from "../AvatarStack/AvatarStack";
import {
	AvatarStackWrapper,
	LinkedTripContainer,
	LinkedTripDuration,
	LinkedTripName,
	LinkedTripTextContainer,
} from "./LinkedTrip.styles";
import BackgroundImageDefault from "../../assets/background.jpeg"

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
	initials: string;
	color: AvatarThemeKeys;
};

interface LinkedTripProps {
	tripName: string;
	duration: string;
	travelers: Traveler[];
	backgroundImg?: string;
	onEditClick: () => void;
}

const LinkedTrip: React.FC<LinkedTripProps> = ({
	tripName,
	duration,
	travelers,
	backgroundImg,
	onEditClick
}) => {
	return (
		<LinkedTripContainer onClick={onEditClick} background={backgroundImg || BackgroundImageDefault}>
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
