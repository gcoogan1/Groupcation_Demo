import { useState } from "react";
import { ErrorText, InputContainer, StyledSelect, StyledLabel, IconWrapper } from "./InputSelect.styles";
import ChevDown from "../../../assets/Chevron_Down.svg?react";

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  error?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({ label, name, options, placeholder, error }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <InputContainer>
      <StyledLabel isError={error}>{label}</StyledLabel>
      <IconWrapper>
        <ChevDown />
      </IconWrapper>
      <StyledSelect
        name={name}
        value={selectedOption}
        onChange={handleChange}
        aria-label={name}
        isError={error}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <ErrorText isError={error}>This field is required.</ErrorText>
    </InputContainer>
  );
};

export default InputSelect;
