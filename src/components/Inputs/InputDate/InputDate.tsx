import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, FieldError, Control } from "react-hook-form";
import {
	ErrorText,
	InputContainer,
	StyledInput,
	StyledLabel,
	InputWrapper,
	IconWrapper,
} from "./InputDate.styles";
import Date from "@assets/Date.svg?react";

interface InputDateProps {
	label: string;
	placeholder?: string;
	name: string;
	error?: FieldError;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
}

const InputDate: React.FC<InputDateProps> = ({
	label,
	placeholder,
	name,
	error,
	control,
}) => {
	return (
		<InputContainer>
			<StyledLabel is_error={!!error}>{label}</StyledLabel>
			<InputWrapper is_error={!!error}>
				<IconWrapper>
					<Date />
				</IconWrapper>
				<Controller
					name={name}
					control={control}
					render={({ field }) => (
						<DatePicker
							selected={field.value}
							onChange={(date) => {
								field.onChange(date);
							}}
							dateFormat="dd/MM/yyyy"
							placeholderText="DD/MM/YYYY"
							customInput={
								<StyledInput
									is_error={!!error}
									placeholder={placeholder}
									aria-label={name}
								/>
							}
						/>
					)}
				/>
			</InputWrapper>
			<ErrorText is_error={!!error}>{error?.message}</ErrorText>
		</InputContainer>
	);
};

export default InputDate;
