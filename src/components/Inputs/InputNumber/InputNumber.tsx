import { useState } from "react";
import {
	ErrorText,
	InputContainer,
	InputSymbol,
	StyledInput,
	StyledLabel,
} from "./InputNumber.styles";
import { UseFormRegister } from "react-hook-form";

interface InputNumberProps {
	label: string;
	name: string;
	value: number;
	onChange: (value: number) => void;
	error?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
}

const InputNumber: React.FC<InputNumberProps> = ({
	label,
	name,
	value,
	onChange,
	error,
	register
}) => {
	const [displayValue, setDisplayValue] = useState((value / 100).toFixed(2));

	const formatCurrency = (num: number) => (num / 100).toFixed(2);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Numbers only
		const rawValue = event.target.value.replace(/\D/g, "");
		// Convert to int
		const numericValue = parseInt(rawValue || "0", 10);

		setDisplayValue(formatCurrency(numericValue));
		onChange(numericValue);
	};
	
	return (
		<InputContainer>
			<StyledLabel is_error={error}>{label}</StyledLabel>
			<InputSymbol>$</InputSymbol>
			<StyledInput
				type="text"
				{...register(name)}
				is_error={error}
				value={displayValue}
				aria-label={name}
				onChange={handleChange}
			/>
			<ErrorText is_error={error}>This field is required.</ErrorText>
		</InputContainer>
	);
};

export default InputNumber;
