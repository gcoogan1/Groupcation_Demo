import React from "react";
import {
	BodyContainer,
	Footer,
	FooterText,
	Header,
	PageContainer,
	PageNavbar,
	NavbarCloseButton,
	NavbarContainer,
	SubTitle,
	Title,
	TitleAction,
	TitleContainer,
} from "./PageWrapper.styles";
import Close from "@assets/Close.svg?react";

interface PageWrapperProps {
	onClose: () => void;
	children: React.ReactNode;
  groupcationTitle: string;
  formTitle: string;
  formTitleAction: string
}

const PageWrapper: React.FC<PageWrapperProps> = ({
	onClose,
	children,
  groupcationTitle,
  formTitle,
  formTitleAction
}) => {

	return (
		<PageContainer>
			<PageNavbar>
				<NavbarContainer>
					<NavbarCloseButton onClick={onClose}>
						<Close />
					</NavbarCloseButton>
				</NavbarContainer>
			</PageNavbar>
			<Header>
				<TitleContainer>
					<SubTitle>{groupcationTitle}</SubTitle>
					<Title>
						{formTitle} <TitleAction>{formTitleAction}</TitleAction>
					</Title>
				</TitleContainer>
			</Header>
			<BodyContainer onClick={(e) => e.stopPropagation()}>
				{children}
			</BodyContainer>
      <Footer>
        <FooterText>Custom Trip Created in Groupcation</FooterText>
      </Footer>
		</PageContainer>
	);
};

export default PageWrapper;
