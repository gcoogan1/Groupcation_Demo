import styled from "styled-components";
import { theme } from "../../styles/theme";

interface AvatarContainerProps {
  backgroundColor: string
}

export const AvatarContainer = styled.div<AvatarContainerProps>`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const AvatarText = styled.p`
  color: ${theme.base};
  font-size: 12px;
  font-weight: 800;
  color: ${theme.base};
  text-transform: uppercase;
  line-height: 16px;
`