import styled from "styled-components";
import { theme } from "@styles/theme";


export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 12px;
  background: ${theme.base};
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${theme.secondary};
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

export const StyledSelect = styled.select`
  width: 100%;
  padding: 16px;
  padding-right: 36px;
  font-family: "Rubik";
  border: 2px solid ${theme.secondary};
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