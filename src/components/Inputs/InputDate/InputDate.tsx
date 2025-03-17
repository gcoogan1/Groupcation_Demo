import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorText, InputContainer, StyledInput, StyledLabel, InputWrapper, IconWrapper } from "./InputDate.styles";
import Date from "../../../assets/Date.svg?react";

interface InputDateProps {
  label: string;
  placeholder?: string;
  name: string;
  error?: boolean;
}

const InputDate: React.FC<InputDateProps> = ({ label, placeholder, name, error }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <InputContainer>
      <StyledLabel isError={error}>{label}</StyledLabel>
      <InputWrapper isError={error}>
        <IconWrapper>
          <Date />
        </IconWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
          customInput={<StyledInput isError={error} placeholder={placeholder} aria-label={name} />}
        />
      </InputWrapper>
       <ErrorText isError={error}>This field is required.</ErrorText>
    </InputContainer>
  );
};

export default InputDate;
