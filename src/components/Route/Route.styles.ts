import styled from "styled-components";
import { theme } from "@styles/theme";

interface RouteContainerProps {
	isExpanded: boolean;
}

export const RouteContainer = styled.div<RouteContainerProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 400px;
	min-height: 70px;
	border-radius: 8px;
	cursor: ${({ isExpanded }) => isExpanded ? 'auto' : 'pointer'};
	border: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "2px solid transparent"};
	box-shadow: ${({ isExpanded }) =>
		isExpanded ? "4px 4px 16px 0px rgba(0, 0, 0, 0.04)" : "none"};
	background-color: ${({ isExpanded }) =>
		isExpanded ? theme.surface : "transparent"};
`;

export const RouteItem = styled.div<RouteContainerProps>`
	display: flex;
	align-items: center;
	width: 100%;
  padding: 8px 24px;
`;

export const RouteHighlightText = styled.span`
	color: ${theme.walking};
`;

export const RouteText = styled.p`
	font-size: 14px;
	font-weight: 400;
	flex: 1;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const ExpandableContent = styled.div<RouteContainerProps>`
	overflow: hidden;
	background-color: ${theme.base};
	border-top: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "none"};
`;

export const ContentContainer = styled.div`
  padding: 24px;
  display: flex:
  justify-content: center;
  align-items: content;
  gap: 16px;
`;

export const AddNotesContainer = styled.div`
	display: flex;
	gap: 8px;
`;

export const AddNotesTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	color: ${theme.iconText};
`;
export const AddNotesContent = styled.div`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const RouteFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-top: 2px solid ${theme.line};
`;

export const RouteFooterTitle = styled.p`
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;
	color: ${theme.iconText};
`;

export const RouteFooterContent = styled.p`
	font-size: 12px;
	font-weight: 600;
	line-height: 16px;
	color: ${theme.iconText};
`;
