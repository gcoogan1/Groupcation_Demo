
import { useState } from "react";
import { InputContainer, StyledSelect, StyledLabel, IconWrapper } from "./InputSelect.styles";
import ChevDown from "../../../assets/Chevron_Down.svg?react";
import { UseFormRegister } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>; 
}

const InputSelect: React.FC<InputSelectProps> = ({ label, name, options, placeholder, register }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <InputContainer>
      <StyledLabel>{label}</StyledLabel>
      <IconWrapper>
        <ChevDown />
      </IconWrapper>
      <StyledSelect
        {...register(name)}
        value={selectedOption}
        onChange={handleChange}
        aria-label={name}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </InputContainer>
  );
};

export default InputSelect;