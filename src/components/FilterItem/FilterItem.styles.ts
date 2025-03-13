import styled from "styled-components";
import { theme } from "../../styles/theme";

interface FilterItemProps {
  addBackground: boolean;
}

export const FilterItemContainer = styled.div<FilterItemProps>`
  width: 200px;
  background: ${({ addBackground }) => addBackground ? '#FAFAFA' : 'transparent'};
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
`

export const FilterItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FilterItemText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${theme.secondary};
`