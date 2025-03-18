import {
	ErrorText,
	InputContainer,
	StyledInput,
	StyledLabel,
} from "./InputTextArea.styles";

interface InputTextAreaProps {
	label: string;
	placeholder?: string;
	name: string;
	error?: boolean;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({
	label,
	placeholder,
	name,
	error,
}) => {
	return (
		<InputContainer>
			<StyledLabel isError={error}>{label}</StyledLabel>
			<StyledInput
				isError={error}
				placeholder={placeholder}
				aria-label={name}
			/>
			<ErrorText isError={error}>This field is required.</ErrorText>
		</InputContainer>
	);
};

export default InputTextArea;
