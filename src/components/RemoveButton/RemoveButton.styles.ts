import styled from "styled-components";
import { theme } from "@styles/theme";

export const RemoveButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`
export const RemoveButtonText = styled.p`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${theme.iconText}
`
