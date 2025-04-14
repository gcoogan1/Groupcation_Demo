import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MenuItemContainer = styled.div`
  width: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 4px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export const MenuItemText = styled.p`
  font-size: 12px;
  font-weight: 400px;
  line-height: 16px;
  color: ${theme.secondary};
`