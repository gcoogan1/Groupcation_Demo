import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const AttachmentContainer = styled.div`
	width: 240px;
	max-width: 480px;
	border-radius: 4px;
	display: flex;
	gap: 8px;
	padding: 16px;
  flex-direction: column;
	border: 2px solid ${theme.secondary};
`;

export const AttachmentList = styled.ul`
	padding: 0;
	list-style: none;
	border: 1px solid ${theme.line};
	border-radius: 4px;
`;

export const AttachmentItem = styled.li`
	border-bottom: 1px solid ${theme.line};
	display: flex;
	padding: 8px;
	gap: 8px;
`;

export const FileContainer = styled.div`
	display: flex;
	padding: 8px;
	gap: 8px;
	flex: 2;
`;

export const FileIconWrapper = styled.div`
	width: 20px;
	height: 20px;
`;

export const FileName = styled.p`
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	color: ${theme.secondary};
`;

export const FileSize = styled.p`
	font-size: 12px;
	line-height: 16px;
	font-weight: 400;
	color: ${theme.iconText};
`;

export const FileDeleteWrapper = styled.div`
	width: 20px;
	height: 20px;
  align-self: center;
`;

export const FileInput = styled.input`
  display: none;
`
