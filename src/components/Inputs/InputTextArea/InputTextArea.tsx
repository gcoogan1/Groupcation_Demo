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
			<StyledLabel is_error={error}>{label}</StyledLabel>
			<StyledInput
				is_error={error}
				placeholder={placeholder}
				aria-label={name}
			/>
			<ErrorText is_error={error}>This field is required.</ErrorText>
		</InputContainer>
	);
};

export default InputTextArea;
