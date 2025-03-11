import styled from "styled-components";
import { theme } from "../../styles/theme";

interface LinkedTripContainerProps {
	background: string;
}

export const LinkedTripContainer = styled.div<LinkedTripContainerProps>`
	border-radius: 12px;
	display: inline-flex;
	justify-content: space-between;
	padding: 16px;
	background: linear-gradient(90deg, black 0%, rgba(0, 0, 0, 0) 100%),
		${({ background }) => `url(${background})`};
	background-size: cover;
	background-position: center;
	align-items: center;
	flex-wrap: wrap;
	align-content: center;

	@media (max-width: 511px) {
		flex-direction: column;
		gap: 16px;
		align-items: flex-start;
	}
`;

export const LinkedTripTextContainer = styled.div`
	flex: 1;
	display: inline-flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`;

export const LinkedTripName = styled.p`
	color: ${theme.base};
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	word-wrap: break-word;
`;

export const LinkedTripDuration = styled.p`
	color: ${theme.line};
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;
	word-wrap: break-word;
`;

export const AvatarStackWrapper = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
`;
