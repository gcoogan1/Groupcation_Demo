import styled from "styled-components";
import { theme } from "../../styles/theme";

export const FilterChipContainer = styled.div`
    border: 1px solid ${theme.surface};
    padding: 8px 8px 8px 12px;
    border-radius: 999px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    justify-content: center;
    align-items: center;
`

export const FilterChipText = styled.p`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: ${theme.secondary};
`
