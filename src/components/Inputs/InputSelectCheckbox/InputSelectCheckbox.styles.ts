import styled from "styled-components";
import { theme } from "@styles/theme";

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 12px;
  background: ${theme.base};
  padding: 0 4px;
	z-index: 2;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${theme.secondary};
  transition: all 0.2s ease;
  pointer-events: none;
`;
