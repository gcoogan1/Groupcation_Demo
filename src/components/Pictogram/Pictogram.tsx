import { PictogramContainer } from "./Pictogram.styles";

import { theme } from "../../styles/theme";

type ThemeKeys = keyof typeof theme;

interface PictogramProps {
	type: ThemeKeys;
	size?: "small" | "medium";
	innerBorderColor?: string;
	children: React.ReactNode;
}

const Pictogram: React.FC<PictogramProps> = ({
	size = "small",
	type,
	innerBorderColor,
	children,
}) => {
	return (
		<PictogramContainer
			size={size}
			backgroundColor={theme[type] || theme.primary}
			innerBorderColor={innerBorderColor}
		>
			{children}
		</PictogramContainer>
	);
};

export default Pictogram;
