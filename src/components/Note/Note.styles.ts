import styled from "styled-components";
import { theme } from "@styles/theme";

interface NoteContainerProps {
	isExpanded: boolean;
}

export const NoteContainer = styled.div<NoteContainerProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	border-radius: 8px;
	min-height: 70px;
	cursor: ${({ isExpanded }) => (isExpanded ? "auto" : "pointer")};
	border: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "2px solid transparent"};
	box-shadow: ${({ isExpanded }) =>
		isExpanded ? "4px 4px 16px 0px rgba(0, 0, 0, 0.04)" : "none"};
	background-color: ${({ isExpanded }) =>
		isExpanded ? theme.surface : "transparent"};
`;

export const NoteLine = styled.div<NoteContainerProps>`
	height: 1px;
	align-self: stretch;
	margin: 0px 16px 0px 24px;
	background: ${({ isExpanded }) =>
		isExpanded
			? "transparent"
			: "linear-gradient(90deg, #cfa629 50%, rgba(207, 166, 41, 0) 100%)"};
`;

export const NoteItem = styled.div<NoteContainerProps>`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 8px 16px 8px 24px;
	gap: 16px;
`;

export const CollapseButtonContainer = styled.div`
	width: 40px;
	height: 40px;
`;

export const NoteItemContent = styled.div`
	/* overflow: hidden;
	flex: 1;
	display: flex;
	align-items: center;
	text-overflow: ellipsis;
	white-space: nowrap; */
	display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    /* padding: 8px 24px; */
`;

export const NoteHighlightText = styled.span`
	color: ${theme.note};
`;

export const NoteText = styled.p`
	font-size: 14px;
	font-weight: 400;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 300px;
	line-height: 20px;
	color: ${theme.iconText};

	@media (max-width: 512px) {
		max-width: 200px;
	}
`;

export const ExpandableContent = styled.div<NoteContainerProps>`
	overflow: hidden;
	background-color: ${theme.base};
	width: 100%;
	border-top: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "none"};
`;

export const ContentContainer = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const AddNotesContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
`;

export const AddNotesTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const AddNotesContent = styled.div`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${theme.iconText};
`;

export const NoteFooter = styled.div`
	padding: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	border-top: 2px solid ${theme.line};
`;

export const NoteFooterTitle = styled.p`
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;
	color: ${theme.iconText};
`;

export const NoteFooterContent = styled.p`
	font-size: 12px;
	font-weight: 600;
	line-height: 16px;
	color: ${theme.iconText};
`;
