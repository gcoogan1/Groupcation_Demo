import styled from "styled-components";

interface PictogramContainerProps {
  backgroundColor: string;
  size: 'small' | 'medium';
  innerBorderColor?: string
}

export const PictogramContainer = styled.div<PictogramContainerProps>`
  width: ${({ size }) => (size === 'medium' ? '36px' : '32px')};
  height: ${({ size }) => (size === 'medium' ? '36px' : '32px')};
  display: flex;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  padding: 8px;
  border-radius: 999px;
  box-shadow: ${({ innerBorderColor }) => (innerBorderColor ? `inset 0 0 0 2px ${innerBorderColor}` : 'none' ) }
`;