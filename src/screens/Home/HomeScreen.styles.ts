import styled from "styled-components";
import { theme } from "@styles/theme";
import switzerlandBackground from "@assets/switzerland.jpeg";

interface NumberIconProps {
  period: string;
}

export const ScreenContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: ${theme.base};
  display: flex;
  flex-direction: column;
`;

//  -- HEADER -- //

export const TopContainer = styled.div`
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 512px) {
    padding: 40px 16px;
  }

  @media (max-width: 320px) {
    padding: 0px 0px 40px 0px;
  }
`;

export const HeaderCover = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 320px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background-image: url(${switzerlandBackground});
  background-size: cover;
  background-position: center;

  @media (max-width: 920px) {
    max-width: 840px;
  }

  @media (max-width: 512px) {
    max-width: 480px;
  }

  @media (max-width: 320px) {
    max-width: 100%;
    border-radius: 0px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  padding: 32px;
  width: 100%;
  border-radius: 16px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  background: linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 100%);

  @media (max-width: 320px) {
    border-radius: 0px;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: ${theme.base};
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
`;

export const HeaderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HeaderDates = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const HeaderDateText = styled.p`
  color: ${theme.base};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

export const HeaderDateSeperator = styled.span`
  color: ${theme.iconText};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

export const HeaderDestinations = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4px;
`;

export const DestinationContainer = styled.div`
  display: flex;
  padding: 4px 8px 4px 4px;
  align-items: center;
  gap: 4px;
  border: 1px solid ${theme.iconText};
  border-radius: 999px;
`;

export const DestinationIcon = styled.div`
  width: 20px;
  height: 20px;
`;

export const DestinationText = styled.div`
  color: ${theme.base};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

//  -- BODY -- //

export const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-bottom: 80px;
  align-self: stretch;
  /* width: 100%; */
  /* flex-grow: 1; */
  gap: 10px;

  @media (max-width: 920px) {
    gap: 0px;
    padding: 0px 40px 80px 40px;
    align-items: center;
  }
`;

export const BodyContentContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 840px;
  justify-content: center;
  align-items: flex-start;
  gap: 64px;

  @media (max-width: 768px) {
    padding: 0px 40px;
  }

  @media (max-width: 512px) {
    max-width: 480px;
    padding: 0px 16px;
    flex: 1 0 0;
  }
`;

export const PanelOverlay = styled.div`
  @media (max-width: 512px) {
    display: flex;
    padding: 54px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const PanelWrapper = styled.div`
  position: absolute;
  top: 100%; /* Position modal just below the button */
  left: 0;
  margin-top: 10px;
  width: 100%;
  z-index: 1000;

  @media (max-width: 512px) {
    width: 100%;
    height: 100%;
    position: relative;
    justify-items: center;
    align-content: center;
    top: 0 !important;
    left: 0 !important;
    border-radius: 16px;
  }
`;

export const ButtonWrapper = styled.div`
display: none;
  @media (max-width: 512px) {
    padding: 8px 0px;
    display: block;
    width: 256px;
    justify-items: flex-end;
  }
`;

export const Filters = styled.div`
  width: 240px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid ${theme.line};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FiltersModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid ${theme.line};
  overflow: hidden;
`

export const Filter = styled.div`
  width: 100%;
  box-shadow: inset 0 -1px 0 0 ${theme.line}; /* bottom border */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const FilterHeader = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.base};
  box-shadow: 0px 8px 16px -8px rgba(0, 0, 0, 0.08);
`;

export const FilterBody = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  gap: 2px;
  overflow: hidden;
  flex-direction: column;
  align-items: flex-start;
`;

export const FilterHeaderText = styled.p`
  color: ${theme.secondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const ItineraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  flex: 1 0 0;

  @media (max-width: 920px) {
    border-bottom: 80px;
  }

  @media (max-width: 512px) {
    border-bottom: 0px;
  }
`;

export const ItineraryActions = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  gap: 16px;
  min-height: 52px;
  align-self: stretch;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const ActionFilters = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 4px;
  flex: 1 0 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    flex: auto;
  } 
`;

export const ActionButtonsContainer = styled.div`
  @media (max-width: 768px) {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
  }
`

export const FilterItineraryButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    flex: 1;
  };
`

export const ActionFilterLabelContainer = styled.div`
  display: flex;
  padding: 6px 0px;
  height: 34px; // not in docs
  justify-content: center;
  align-items: center;
`;

export const FilterChipContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  gap: 4px;
  /* flex: 1 0 0; */
  flex-wrap: wrap;
`

export const ActionFilterLabel = styled.p`
  color: ${theme.iconText};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const ActionFilterChipsContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  gap: 4px;
  flex: 1 0 0;
  flex-wrap: wrap;
`;

export const DaysContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  /* align-self: stretch; */
`;

export const Day = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  align-items: stretch; // Makes line expand when activity does
`;

export const DayNumber = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NumberContainer = styled.div<NumberIconProps>`
  display: flex;
  width: 36px;
  height: 36px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 99px;
  border: ${({ period }) =>
    period === "during"
      ? `4px solid transparent`
      : `4px solid ${theme.surface}`};
  background: ${({ period }) => (period === "during" ? `#e400780d` : "none")};
`;

export const NumberText = styled.p`
  color: ${theme.primary};
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const NumberLine = styled.div<NumberIconProps>`
  width: 4px;
  height: 100%;
  flex: 1;
  background: ${({ period }) =>
    period === "during"
      ? "linear-gradient(180deg, rgba(228, 0, 120, 0.05) 0%, rgba(228, 0, 120, 0.00) 100%)"
      : "linear-gradient(180deg, #F4F4F4 0%, rgba(244, 244, 244, 0.00) 100%)"};
`;

export const DayList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
  min-height: 100px; // not in docs
`;

export const ListDateContent = styled.div`
  display: flex;
  width: 100%;
  padding: 8px 0px;
  align-items: center;
  gap: 8px;
`;

export const ListDate = styled.p`
  counter-reset: ${theme.secondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  flex: 1;
`;

export const ListDay = styled.p`
  color: ${theme.iconText};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

export const ListItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const ListItemsEmpty = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  border-radius: 8px;
  border: 1px dashed ${theme.line};
`;

export const EmptyText = styled.div`
  overflow: hidden;
  color: ${theme.iconText};
  text-align: center;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

// -- FOOTER -- //

export const Footer = styled.div`
  width: 100%;
  padding: 80px 0px;
  display: flex;
  justify-content: center;
  align-content: center;
  background: ${theme.dark};
`;

export const FooterText = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${theme.iconText};
`;
