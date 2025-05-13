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
  max-height: 600px;
  overflow: scroll;
`;

export const ModalHeader = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: ${theme.base};
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

export const ModalBody = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex: 1 0 0;
`;

export const ModalSubmitContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-top: 1px solid ${theme.line};
  background: ${theme.base};
`
