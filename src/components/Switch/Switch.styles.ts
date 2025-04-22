import styled from "styled-components";
import { theme } from "@styles/theme";

interface SliderProps {
  isOn?: boolean;
}

export const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
`;

export const Slider = styled.span<SliderProps>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ isOn }) => (isOn ? theme.secondary : theme.line)};
  transition: 0.4s;
  border-radius: 999px;
  padding: 4px;

  &::before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: ${theme.base};
    transition: 0.4s;
    border-radius: 999px;
    transform: ${({ isOn }) => (isOn ? "translateX(14px)" : "translateX(0)")};
  }
`;

export const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;
