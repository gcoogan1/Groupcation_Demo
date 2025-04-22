import styled from "styled-components";
import { theme } from "@styles/theme";

interface InputContainerProps {
	is_error?: boolean;
}

export const InputContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	cursor: pointer;
`;

export const StyledLabel = styled.label.withConfig({
	shouldForwardProp: (prop) => prop !== "is_error",
})<InputContainerProps>`
	position: absolute;
	top: -8px;
	left: 12px;
	background: ${theme.base};
	padding: 0 4px;
	font-size: 12px;
	font-weight: 600;
	line-height: 16px;
	color: ${({ is_error }) => (is_error ? theme.error : theme.secondary)};
`;

export const InputWrapper = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== "is_error",
})<{ is_error?: boolean }>`
	width: 100%;
	padding: 16px;
	font-family: "Rubik";
	border: ${({ is_error }) =>
		is_error ? `2px solid ${theme.error}` : `2px solid ${theme.secondary}`};
	border-radius: 4px;
	background: ${theme.base};
	font-size: 14px;
	color: ${theme.secondary};
	line-height: 20px;
	font-weight: 400;
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const IconWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const StyledInput = styled.input.withConfig({
	shouldForwardProp: (prop) => prop !== "is_error",
})<{ is_error?: boolean }>`
	width: 100%;
	font-family: "Rubik";
	font-size: 14px;
	border: none;
	color: ${theme.secondary};
	outline: none;

	&:focus {
		outline: none;
		box-shadow: none;
	}

	&::placeholder {
		color: ${theme.iconText};
	}

	.react-datepicker-wrapper,
	.react-datepicker__input-container input {
		width: 100%;
		outline: none;
		border: none;
	}
`;

export const ErrorText = styled.span.withConfig({
	shouldForwardProp: (prop) => prop !== "is_error",
})<{ is_error?: boolean }>`
	font-size: 14px;
	color: red;
	visibility: ${({ is_error }) => (is_error ? "visible" : "hidden")};
	margin-top: 6px;
	height: 18px;
	align-self: baseline;
	left: 0;
`;
