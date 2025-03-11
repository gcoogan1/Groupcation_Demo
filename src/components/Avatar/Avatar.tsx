import { AvatarContainer, AvatarText } from "./Avatar.styles";

const avatarTheme = {
	red: "linear-gradient(135deg, #EF3E88 0%, #651A50 100%)",
	pink: "linear-gradient(135deg, #EF3EEC 0%, #361A65 100%)",
	green: "linear-gradient(135deg, #BAEF3E 0%, #25651A 100%)",
	purple: "linear-gradient(135deg, #763EEF 0%, #231A65 100%)",
	orange: "linear-gradient(135deg, #EF683E 0%, #65251A 100%)",
	blue: "linear-gradient(135deg, #3E9CEF 0%, #1A3565 100%)",
	teal: "linear-gradient(135deg, #92EADF 0%, #3C5758 100%)",
	gold: "linear-gradient(135deg, #EFB13E 0%, #654B1A 100%)",
	brown: "linear-gradient(135deg, #EEB0A5 0%, #615249 100%)",
};

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
