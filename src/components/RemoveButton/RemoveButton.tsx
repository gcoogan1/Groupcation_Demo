import { RemoveButtonContainer, RemoveButtonText } from "./RemoveButton.styles";
import Remove from "../../assets/Remove.svg?react";
import { theme } from "../../styles/theme";

interface RemoveButtonProps {
  onRemove: () => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ onRemove }) => {
  return (
    <RemoveButtonContainer onClick={onRemove}>
      <Remove style={{ width: '16px', height: '16px' }} color={theme.iconText} />
      <RemoveButtonText>Remove</RemoveButtonText>
    </RemoveButtonContainer>

  )
}

export default RemoveButton