import { ErrorText, InputContainer, StyledInput, StyledLabel } from "./InputText.styles";

interface InputTextProps {
  label: string;
  placeholder?: string;
  name: string;
  error?: boolean;
}

const InputText: React.FC<InputTextProps> = ({ label, placeholder, name, error }) => (
  <InputContainer>
    <StyledLabel isError={error}>{label}</StyledLabel>
    <StyledInput isError={error} placeholder={placeholder} aria-label={name} />
    <ErrorText isError={error}>This field is required.</ErrorText>
  </InputContainer>
);

export default InputText
