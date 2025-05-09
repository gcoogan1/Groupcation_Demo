import styled from "styled-components";
import { theme } from "@styles/theme";

interface ActivityContainerProps {
	isExpanded: boolean;
}

export const ActivityContainer = styled.div<ActivityContainerProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
	/* max-width: 400px; */
	width: 100%;
	border-radius: 8px;
	min-height: 70px;
	cursor: ${({ isExpanded }) => (isExpanded ? "auto" : "pointer")};
	border: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "2px solid transparent"};
	box-shadow: ${({ isExpanded }) =>
		isExpanded ? "4px 4px 16px 0px rgba(0, 0, 0, 0.04)" : "none"};
	background-color: ${theme.baseSecond};
`;

export const ActivityLine = styled.div`
	height: 1px;
	align-self: stretch;
	margin: 0px 16px 0px 24px;
	background: linear-gradient(90deg, #cfa629 50%, rgba(207, 166, 41, 0) 100%);
`;

export const ActivityItem = styled.div<ActivityContainerProps>`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 16px;
	justify-content: space-between;
	gap: 16px;
`;

export const CollapseButtonContainer = styled.div`
	width: 40px;
	height: 40px;
`

export const ActivityItemContent = styled.div`
	overflow: hidden;
	display: flex;
	align-items: center;
	/* text-overflow: ellipsis;
	white-space: nowrap; */
	gap: 8px;
`;

export const ActivityHighlightText = styled.span`
	color: ${theme.rental};
`;

export const ActivityText = styled.p`
	font-size: 14px;
	font-weight: 600;
	flex: 1;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const DepartureText = styled.p`
	font-size: 12px;
	color: ${theme.iconText};
	font-weight: 400;
	line-height: 16px;
`;

export const ExpandableContent = styled.div<ActivityContainerProps>`
	overflow: hidden;
	background-color: ${theme.base};
	width: 100%;
	border-top: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "none"};
`;

export const ContentContainer = styled.div`
  padding: 24px;
  display: flex;
	flex-direction: column;
  justify-content: center;
  align-items: content;
  gap: 16px;
`;

export const PrimaryContent = styled.div``;

export const SecondaryContent = styled.div`
	display: flex;
	gap: 8px;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
`;

export const SecondaryLink = styled.div`
	display: flex;
	padding: 8px;
	gap: 8px;
	width: 100%;
	justify-content: space-between;
  cursor: pointer;
`;

export const LinkContent = styled.div`
	display: flex;
	gap: 8px;
`;

export const LinkTextContainer = styled.div`
  flex: 1;
`

export const LinkTextTitle = styled.p`
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	color: ${theme.iconText};
`;

export const LinkText = styled.p`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${theme.secondary};
	overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

export const ChevIcon = styled.div`
	width: 20px;
	height: 20px;
	align-self: center;
`;

export const SecondaryDivider = styled.div`
	width: 100%;
	height: 1px;
	background: ${theme.line};
`;

export const ActivityFooter = styled.div`
	padding: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	border-top: 2px solid ${theme.line};
`;

export const ActivityFooterTitle = styled.p`
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;
	color: ${theme.iconText};
`;

export const ActivityFooterContent = styled.p`
	font-size: 12px;
	font-weight: 600;
	line-height: 16px;
	color: ${theme.iconText};
`;
