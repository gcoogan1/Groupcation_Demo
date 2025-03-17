import styled from "styled-components";
import { theme } from "../../../styles/theme";

interface InputContainerProps {
  isError?: boolean;
}

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
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
  color: ${({ isError }) => isError ? theme.error : theme.secondary };;
`;

export const InputSymbol = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: "Rubik";
  line-height: 20px;
  color: ${theme.secondary};
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
`

export const StyledInput = styled.input<InputContainerProps>`
  width: 100%;
  padding: 16px 16px 16px 32px;
  font-family: "Rubik";
  border: ${({ isError }) => isError ? `2px solid ${theme.error}` : `2px solid ${theme.secondary}` };
  border-radius: 4px;
  background: ${theme.base};
  font-size: 14px;
  outline: none;
  color: ${theme.secondary};
  line-height: 20px;
  font-weight: 400;


  &::placeholder {
    color: ${theme.iconText};
  }
`;

export const ErrorText = styled.span<InputContainerProps>`
  position: absolute;
  bottom: -22px;
  font-size: 14px;
  color: ${theme.error};
  visibility: ${({ isError }) => isError ? 'visable' : 'hidden' };
`;

