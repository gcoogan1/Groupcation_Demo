import DatePicker from "react-datepicker";
import { FieldError, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import {
	ErrorText,
	InputContainer,
	StyledInput,
	StyledLabel,
	InputWrapper,
	IconWrapper,
} from "./InputTime.styles";
import Time from "@assets/Time.svg?react";

interface InputTimeProps {
	label: string;
	placeholder?: string;
	name: string;
	error?: FieldError;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: any;
}

const InputTime: React.FC<InputTimeProps> = ({
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
					<Time />
				</IconWrapper>
				<Controller
					name={name}
					control={control}
					render={({ field: { value, onChange, ref } }) => (
						<DatePicker
							{...ref}
							selected={value ? new Date(value) : null}
							onChange={(time) => onChange(time ?? null)}
							showTimeSelect
							showTimeSelectOnly
							timeIntervals={15}
							timeCaption="Time"
							dateFormat="h:mm aa"
							placeholderText={placeholder || "HH:MM AM"}
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

export default InputTime;
