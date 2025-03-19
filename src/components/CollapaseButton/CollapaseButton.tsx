import ChevronUp from "../../assets/Chevron_Up.svg?react";
import ChevronDown from "../../assets/Chevron_Down.svg?react";
import { CollapseButtonContainer } from "./CollapaseButton.styles";
import { theme } from "../../styles/theme";

interface CollapseButtonProps {
	expanded?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; 
}

const CollapaseButton: React.FC<CollapseButtonProps> = ({ expanded = false, onClick }) => {
	return (
		<CollapseButtonContainer
			style={{ backgroundColor: !expanded ? theme.line : "transparent" }}
			onClick={onClick}
		>
			{expanded ? (
				<ChevronDown color={theme.iconText} />
			) : (
				<ChevronUp color={theme.iconText} />
			)}
		</CollapseButtonContainer>
	);
};

export default CollapaseButton;
