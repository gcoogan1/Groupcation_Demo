import React, { useRef, useState } from "react";
import NoteIcon from "@assets/Note.svg?react";
import {
	AddNotesContainer,
	AddNotesContent,
	AddNotesTitle,
	ContentContainer,
	ExpandableContent,
	NoteContainer,
	NoteFooter,
	NoteFooterContent,
	NoteFooterTitle,
	NoteHighlightText,
	NoteItem,
	NoteLine,
	NoteText,
	NoteItemContent,
} from "./Note.styles";
import { theme } from "@styles/theme";
import CollapaseButton from "../CollapaseButton/CollapaseButton";
import Button from "../Button/Button";
import Edit from "@assets/Edit.svg?react";

interface NotesProps {
	onEditClick: () => void;
	hightlightedNoteAction: string;
	noteText: string;
	extendedNotesTitle: string;
	extendedNoteText: string;
	footerText: string;
}

const Note: React.FC<NotesProps> = ({
	onEditClick,
	hightlightedNoteAction,
	extendedNotesTitle,
	extendedNoteText,
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
		<NoteContainer
			isExpanded={expanded}
			onClick={toggleExpand}
			style={{ flexDirection: "column" }}
		>
			<>
				<NoteLine isExpanded={expanded} />
				<NoteItem isExpanded={expanded}>
					<NoteItemContent>
						<NoteIcon color={theme.note} />
						<NoteText>
							<NoteHighlightText>{hightlightedNoteAction} </NoteHighlightText>
							{extendedNoteText}
						</NoteText>
					</NoteItemContent>
					{expanded && (
						<CollapaseButton
							onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
								event.stopPropagation();
								setExpanded(false);
							}}
						/>
					)}
				</NoteItem>
				<NoteLine isExpanded={expanded} />
			</>
			<ExpandableContent
				isExpanded={expanded}
				ref={contentRef}
				style={{ maxHeight: expanded ? contentRef.current?.scrollHeight : 0 }}
			>
				<ContentContainer>
					<AddNotesContainer>
						<AddNotesTitle>{extendedNotesTitle}</AddNotesTitle>
						<AddNotesContent>{extendedNoteText}</AddNotesContent>
					</AddNotesContainer>
				</ContentContainer>
				<NoteFooter>
					<div>
						<NoteFooterTitle>Added By</NoteFooterTitle>
						<NoteFooterContent>{footerText}</NoteFooterContent>
					</div>
					<Button
						leftIcon={<Edit color={theme.secondary} />}
						color={"outlined"}
						ariaLabel={"edit"}
						onClick={onEditClick}
					>
						Edit
					</Button>
				</NoteFooter>
			</ExpandableContent>
		</NoteContainer>
	);
};

export default Note;
