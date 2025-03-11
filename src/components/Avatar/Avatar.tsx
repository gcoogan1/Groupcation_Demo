import { avatarTheme } from "../../styles/theme";
import { AvatarContainer, AvatarText } from "./Avatar.styles";


type AvatarThemeKeys = keyof typeof avatarTheme;

interface AvatarProps {
	initials: string;
	color: AvatarThemeKeys;
}

const Avatar: React.FC<AvatarProps> = ({ initials, color }) => {
	return (
		<AvatarContainer backgroundColor={avatarTheme[color] || avatarTheme.red}>
			<AvatarText>{initials}</AvatarText>
		</AvatarContainer>
	);
};

export default Avatar;
