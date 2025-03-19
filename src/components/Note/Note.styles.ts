import styled from "styled-components";
import { theme } from "../../styles/theme";

interface NoteContainerProps {
	isExpanded: boolean;
}

export const NoteContainer = styled.div<NoteContainerProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 400px;
	border-radius: 8px;
  min-height: 70px;
	cursor: ${({ isExpanded }) => isExpanded ? 'auto' : 'pointer'};
	border: ${({ isExpanded }) =>
		isExpanded ? `2px solid ${theme.line}` : "2px solid transparent"};
	box-shadow: ${({ isExpanded }) =>
		isExpanded ? "4px 4px 16px 0px rgba(0, 0, 0, 0.04)" : "none"};
	background-color: ${({ isExpanded }) =>
		isExpanded ? theme.surface : "transparent"};
`;

export const NoteLine = styled.div`
	height: 1px;
	align-self: stretch;
	margin: 0px 16px 0px 24px;
	background: linear-gradient(90deg, #cfa629 50%, rgba(207, 166, 41, 0) 100%);
`;

export const NoteItem = styled.div<NoteContainerProps>`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 8px 16px 8px 24px;
	gap: 16px;
`;

export const NoteItemContent = styled.div`
	overflow: hidden;
	display: flex;
	align-items: center;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const NoteHighlightText = styled.span`
	color: ${theme.walking};
`;

export const NoteText = styled.p`
	font-size: 14px;
	font-weight: 400;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	line-height: 20px;
	color: ${theme.iconText};
`;

export const ExpandableContent = styled.div<NoteContainerProps>`
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
	flex-direction: column;
	gap: 8px;
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
