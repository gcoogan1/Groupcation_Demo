import styled from "styled-components";
import { theme } from "../../styles/theme";

export const CloseButtonContainer = styled.button`
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 999px;
  background-color: ${theme.surface};
  display: flex;
  justify-content: center;
  align-items: center;
`