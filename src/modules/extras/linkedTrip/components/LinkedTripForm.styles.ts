import styled from "styled-components";
import { theme } from "../../../../styles/theme";

export const FormContainer = styled.form`
  display: flex;
  max-width: 480px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 64px;

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

export const DropoffContainer = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid ${theme.line};
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  padding: 16px;
`

export const DropoffCheckbox = styled.div`
  width: 100%;
  display: flex;
  background-color: ${theme.surface};
  gap: 4px;
  border-radius: 4px;
  padding: 16px;
`

export const DropoffText = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`
