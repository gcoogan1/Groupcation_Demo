import { ButtonContainer, ButtonText } from './Button.styles';

interface ButtonProps {
  color: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  color,
  children,
  ariaLabel,
  onClick,
  leftIcon,
  rightIcon,
}) => {

  const isOutlined = color === 'outlined';
  const isPrimary = color === 'primary'

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Pevents parent click events
    event.stopPropagation()
    onClick()
  }

  return (
    <ButtonContainer
      color={color}
      aria-label={ariaLabel}
      onClick={(e) => handleOnClick(e)}
      showBorder={isOutlined}
    >
      {leftIcon && leftIcon}
      <ButtonText primary={isPrimary}>{children}</ButtonText>
      {rightIcon && rightIcon}
    </ButtonContainer>
  );
};

export default Button;
