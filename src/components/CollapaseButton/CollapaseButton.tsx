import { useState } from "react";

import ChevronUp from "../../assets/Chevron_Up.svg?react";
import ChevronDown from "../../assets/Chevron_Down.svg?react";
import { CollapseButtonContainer } from "./CollapaseButton.styles";
import { theme } from "../../styles/theme";

interface CollapseButtonProps {
	expanded?: boolean;
}

const CollapaseButton: React.FC<CollapseButtonProps> = ({ expanded }) => {
	const [isExpanded, setIsExpanded] = useState(expanded);

	const handleExpand = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<CollapseButtonContainer style={{ backgroundColor: !isExpanded ? theme.line : 'transparent' }} onClick={handleExpand}>
			{isExpanded ? (
				<ChevronDown color={theme.iconText} />
			) : (
				<ChevronUp color={theme.iconText} />
			)}
		</CollapseButtonContainer>
	);
};

export default CollapaseButton;
