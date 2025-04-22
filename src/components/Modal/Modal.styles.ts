import styled from "styled-components";
import { theme } from "@styles/theme";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.80);;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalWrapper = styled.div`
  display: flex;
  max-width: 400px;
  min-width: 140px;
  flex-direction: column;
  align-items: center; 
  border-radius: 12px;
  background: ${theme.base};
  width: 90%;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid ${theme.line};
  text-transform: capitalize;
`

export const HeaderText = styled.p`
  color: ${theme.secondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  flex: 1;
`

// export const CloseButton = styled.button`
//   position: absolute;
//   top: 16px;
//   right: 16px;
//   background: transparent;
//   border: none;
//   cursor: pointer;
// `;

export const ModalBody = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

export const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  padding: 16px;
  background: ${theme.surface};
`

export const ModalCostHeader = styled.p`
  color: ${theme.secondary};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`

export const ModalCostContent = styled.p`
  color: ${theme.secondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`

export const ModalAttachmentsList = styled.ul`
  padding: 0;
	list-style: none;
  cursor: pointer;
  width: 100%;
	border: 1px solid ${theme.line};
	border-radius: 4px;
`

export const ModalAttachmentItem = styled.li`
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
