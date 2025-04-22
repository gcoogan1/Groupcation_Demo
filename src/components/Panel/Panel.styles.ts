import styled from "styled-components";
import { theme } from "@styles/theme";

export const PanelContainer = styled.div`
  display: flex;
  width: 256px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 16px;
  border: 2px solid ${theme.line};
  background: ${theme.base};
  box-shadow: 0px 8px 32px -4px rgba(0, 0, 0, 0.32);
`

export const PanelSection = styled.div`
  display: flex;
  padding-bottom: 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`

export const SectionHeader = styled.div`
  display: flex;
  padding: 16px 16px 8px 16px;
  justify-content: left;
  align-items: center;
  align-self: stretch;
  background: linear-gradient(0deg, rgba(244, 244, 244, 0.00) 0%, #F4F4F4 100%);

  &:first-of-type {
    border-radius: 16px;
  }
`

export const Header = styled.p`
  color: ${theme.iconText};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px
`

export const SectionList = styled.div`
  display: flex;
  /* padding: 0px 8px; */
  align-items: center;
  align-content: center;
  justify-content: baseline;
  align-self: stretch;
  flex-wrap: wrap;
`