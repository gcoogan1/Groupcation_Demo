import styled from "styled-components";
import { theme } from "../../styles/theme";

const ButtonVariants = {
  primary: "linear-gradient(101.36deg, #E40078 0%, #B60060 100%)",
  secondary: theme.line,
  tertiary: theme.surface,
  outlined: theme.base,
};

interface ButtonContainerProps {
  color: keyof typeof ButtonVariants;
  showBorder?: boolean;
}

interface ButtonTextProps {
  primary: boolean;
}

export const ButtonContainer = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "showBorder",
})<ButtonContainerProps>`
  background: ${({ color }) => ButtonVariants[color]};
  box-shadow: ${({ showBorder }) =>
    showBorder ? `inset 0 0 0 2px ${theme.line}` : "none"};
  border-radius: 8px;
  padding: ${({ color }) =>
    // Went from 16px (in doc) to 14px to account for 2px inset
    color === "primary" || color === "secondary" ? "14px" : "12px"};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border: none;

	&:hover {
		opacity: 0.9
	}

	&:active {
		opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ButtonText = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "primary",
})<ButtonTextProps>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ primary }) => (primary ? theme.base : theme.secondary)};
`;
