import { CloseButtonContainer } from "./CloseButton.styles";
import Cancel from "../../assets/Cancel.svg?react"
import { theme } from "../../styles/theme";

interface CloseButtonProps {
  onClose: () => void; 
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <CloseButtonContainer onClick={onClose}>
      <Cancel color={theme.secondary} />
    </CloseButtonContainer>
  )
}

export default CloseButton