/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormRegister, FieldError } from "react-hook-form";
import {
	ErrorText,
	InputContainer,
	StyledInput,
	StyledLabel,
} from "./InputText.styles";

interface InputTextProps {
	label: string;
	placeholder?: string;
	name: string;
	error?: FieldError;
	register: UseFormRegister<any>; //disabled ts for this line bc of any
}

const InputText: React.FC<InputTextProps> = ({
	label,
	placeholder,
	name,
	error,
	register,
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

export default InputText;
