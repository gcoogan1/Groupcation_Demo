import React, { useRef, useState } from "react";
import Walking from "@assets/Walking.svg?react";
import AddNotes from "@assets/AdditionalNotes.svg?react";
import {
	AddNotesContainer,
	AddNotesContent,
	AddNotesTitle,
	ContentContainer,
	ExpandableContent,
	RouteContainer,
	RouteFooter,
	RouteFooterContent,
	RouteFooterTitle,
	RouteHighlightText,
	RouteItem,
	RouteText,
} from "./Route.styles";
import GraphicRoute from "../GraphicRoute/GraphicRoute";
import { theme } from "@styles/theme";
import CollapaseButton from "../CollapaseButton/CollapaseButton";
import Button from "../Button/Button";
import Edit from "@assets/Edit.svg?react";

interface ActivityRouteProps {
	onEditClick: () => void;
	hightlightedRouteAction: string;
	routeText: string;
	notesText: string;
	footerText: string;
}

const ActivityRoute: React.FC<ActivityRouteProps> = ({
	onEditClick,
	hightlightedRouteAction,
	routeText,
	notesText,
	footerText,
}) => {
	const [expanded, setExpanded] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	const toggleExpand = () => {
		if (expanded) return;
		if (contentRef.current) {
			const newHeight = expanded ? "0" : `${contentRef.current.scrollHeight}px`;
			contentRef.current.style.height = newHeight;
			setExpanded((prev) => !prev);
		}
	};

	return (
		<RouteContainer
			isExpanded={expanded}
			onClick={toggleExpand}
			style={{ flexDirection: "column" }}
		>
			<RouteItem isExpanded={expanded}>
				<GraphicRoute type={"walking"}>
					<Walking color={theme.walking} />
				</GraphicRoute>
				<RouteText>
					<RouteHighlightText>{hightlightedRouteAction} </RouteHighlightText>
					{routeText}
				</RouteText>
				{expanded && (
					<CollapaseButton
						onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
							event.stopPropagation();
							setExpanded(false);
						}}
					/>
				)}
			</RouteItem>
			<ExpandableContent
				isExpanded={expanded}
				ref={contentRef}
				style={{ maxHeight: expanded ? contentRef.current?.scrollHeight : 0 }}
			>
				<ContentContainer>
					<AddNotesContainer>
						<AddNotes color={theme.iconText} />
						<div>
							<AddNotesTitle>Additional Notes</AddNotesTitle>
							<AddNotesContent>{notesText}</AddNotesContent>
						</div>
					</AddNotesContainer>
				</ContentContainer>
				<RouteFooter>
					<div>
						<RouteFooterTitle>Added By</RouteFooterTitle>
						<RouteFooterContent>{footerText}</RouteFooterContent>
					</div>
					<Button
						leftIcon={<Edit color={theme.secondary} />}
						color={"outlined"}
						ariaLabel={"edit"}
						onClick={onEditClick}
					>
						Edit
					</Button>
				</RouteFooter>
			</ExpandableContent>
		</RouteContainer>
	);
};

export default ActivityRoute;
