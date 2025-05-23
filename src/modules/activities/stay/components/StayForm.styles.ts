import styled from "styled-components";
import { theme } from "@styles/theme";

export const FormContainer = styled.form`
  display: flex;
  max-width: 480px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 12px;

  @media (max-width: 512px) {
    width: 100%;
    padding: 16px;
  }
`;

export const FormSections = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 64px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export const SectionGraphics = styled.div`
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const SectionGraphicsLine = styled.div`
  height: 100%;
  width: 2px;
  background: ${theme.line};
`;

export const SectionContents = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 64px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`;

export const ContentTitleContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  justify-content: space-between;
`;

export const ContentTitle = styled.p`
  font-size: 18px;
  color: ${theme.iconText};
  font-weight: 600;
  line-height: 24px;
`;

export const SectionInputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputDatesRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const AddDetailsButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const AddMoreSectionContents = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  flex: 1 0 0;
`;

export const AddMoreGraphicsLine = styled.div`
  /* height: 76px; */
  height: 100%;
  width: 2px;
  background: ${theme.line};
`;
