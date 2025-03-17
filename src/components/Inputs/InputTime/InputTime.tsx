import { ErrorText, InputContainer, StyledInput, StyledLabel, InputWrapper, IconWrapper } from "./InputTime.styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Time from "../../../assets/Time.svg?react";
import { useState } from "react";

interface InputTimeProps {
  label: string;
  placeholder?: string;
  name: string;
  error?: boolean;
}

const InputTime: React.FC<InputTimeProps> = ({ label, placeholder, name, error }) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  return (
    <InputContainer>
      <StyledLabel isError={error}>{label}</StyledLabel>
      <InputWrapper isError={error}>
        <IconWrapper>
          <Time />
        </IconWrapper>
        <DatePicker
          selected={selectedTime}
          onChange={(time) => setSelectedTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText={placeholder || "HH:MM AM"}
          customInput={<StyledInput isError={error} placeholder={placeholder} aria-label={name} />}
        />
      </InputWrapper>
      <ErrorText>This field is required.</ErrorText>
    </InputContainer>
  );
};

export default InputTime;
