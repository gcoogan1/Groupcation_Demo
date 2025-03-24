import { FieldError, UseFormRegister } from "react-hook-form";
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
	error?: FieldError;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({
	label,
	placeholder,
	name,
	error,
	register
}) => {
	return (
		<InputContainer>
			<StyledLabel is_error={!!error}>{label}</StyledLabel>
			<StyledInput
				{...register(name)}
				is_error={!!error}
				placeholder={placeholder}
				aria-label={name}
			/>
			<ErrorText is_error={!!error}>{error?.message}</ErrorText>
		</InputContainer>
	);
};

export default InputTextArea;
