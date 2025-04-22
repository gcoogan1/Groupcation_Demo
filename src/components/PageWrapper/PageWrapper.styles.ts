import styled from "styled-components";
import { theme } from "@styles/theme";

export const PageContainer = styled.div`
	width: 100vw;
	min-height: 100vh;
	background-color: ${theme.base};
  display: flex;
  flex-direction: column;
`;

export const PageNavbar = styled.div`
	width: 100%;
	padding: 40px 40px 0px 40px;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 512px) {
		padding: 40px 16px 0px 16px;
	}
`;

export const NavbarContainer = styled.div`
	display: flex;
	width: 100%;
	max-width: 1200px;
	height: 44px;
	align-items: center;

	@media (max-width: 512px) {
		max-width: 480px;
	}

	@media (max-width: 320px) {
		max-width: 288px;
	}
`;

export const NavbarCloseButton = styled.button`
	display: flex;
	padding: 12px;
	align-items: flex-start;
	gap: 4px;
	border-radius: 8px;
	background: ${theme.surface};
	border: none;
	cursor: pointer;
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;

	@media (max-width: 512px) {
		padding: 40px 16px;
	}
`;

export const TitleContainer = styled.div`
	display: flex;
	gap: 4px;
	max-width: 1200px;
	width: 100%;
	flex-direction: column;

	@media (max-width: 512px) {
		max-width: 480px;
	}

	@media (max-width: 320px) {
		max-width: 288px;
	}
`;

export const SubTitle = styled.p`
	text-align: center;
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	color: ${theme.iconText};
`;

export const Title = styled.p`
	text-align: center;
	font-size: 24px;
	font-weight: 800;
	line-height: 36px;
	color: ${theme.secondary};
`;

export const TitleAction = styled.span`
	color: ${theme.train};
`;

export const BodyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-content: center;
	padding-bottom: 80px;
	width: 100%;
  flex-grow: 1;
`;


export const Footer = styled.div`
  width: 100%;
  padding: 80px 0px;
  display: flex;
  justify-content: center;
	align-content: center;
  background: ${theme.dark};
`

export const FooterText = styled.p`
  text-align: center;
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${theme.iconText};
`
