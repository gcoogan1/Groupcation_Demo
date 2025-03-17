import styled from "styled-components";
import { theme } from "../../../styles/theme";

interface InputContainerProps {
  isError?: boolean;
}

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StyledLabel = styled.label<InputContainerProps>`
  position: absolute;
  top: -8px;
  left: 12px;
  background: ${theme.base};
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ isError }) => (isError ? theme.error : theme.secondary)};
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
    fill: ${theme.iconText};
  }
`;

export const StyledSelect = styled.select<InputContainerProps>`
  width: 100%;
  padding: 16px;
  padding-right: 36px; /* Make room for the icon */
  font-family: "Rubik";
  border: ${({ isError }) => (isError ? `2px solid ${theme.error}` : `2px solid ${theme.secondary}`)};
  border-radius: 4px;
  background: ${theme.base};
  font-size: 14px;
  outline: none;
  color: ${theme.secondary};
  line-height: 20px;
  font-weight: 400;
  appearance: none;
  -webkit-appearance: none; 
  -moz-appearance: none;

  &::placeholder {
    color: ${theme.iconText};
  }
`;

export const ErrorText = styled.span<InputContainerProps>`
  position: absolute;
  bottom: -22px;
  font-size: 14px;
  color: ${theme.error};
  visibility: ${({ isError }) => (isError ? "visible" : "hidden")};
`;
