import styled from "styled-components";
import { theme } from "@styles/theme";

export const CardContainer = styled.div`
	border-radius: 12px;
	background: ${theme.surface};
	border: 1px solid ${theme.line};
`;

export const CardHeader = styled.div`
	display: flex;
	width: 100%;
	padding: 16px;
	gap: 8px;
	justify-content: space-between;
`;

export const CardTitle = styled.p`
	font-weight: 600;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const CardSubTitle = styled.p`
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.iconText};
	text-transform: capitalize;
`;

export const CardContents = styled.div`
	border-radius: 16px;
	overflow: hidden;
	background-color: ${theme.base};
	box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
`;

export const ContentDetails = styled.div`
	padding: 16px;

	@media (max-width: 375px) {
		max-width: 240px;	
	}
`;

export const StartEndDetails = styled.div`
	padding: 8px 0px;
	display: flex;
	gap: 12px;
`;

export const DetailsContainer = styled.div`
	padding: 2px 0px;
	display: flex;
	gap: 10px;
`;

export const DetailsTitle = styled.p`
	width: 80px;
	font-weight: 400;
	font-size: 12px;
	line-height: 16px;
	color: ${theme.iconText};
	text-align: right;
`;

export const DetailsText = styled.div``;

export const TimeText = styled.p`
	font-weight: 600;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.secondary};
`;

export const LocationText = styled.p`
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.secondary};
`;


export const ContentFooter = styled.div`
	padding: 16px;
	display: flex;
	border-top: 1px solid ${theme.line};
  width: 100%;
  justify-content: space-between;
`;

export const FooterContents = styled.div`
	display: flex;
	gap: 8px;
`;

export const FooterTextContainer = styled.div`
  display: flex;
  gap: 4px;
`;

export const FooterTitle = styled.p`
	font-weight: 600;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.iconText};
`;

export const FooterText = styled.p`
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	color: ${theme.secondary};
`;
