import { ButtonContainer, ButtonText } from './Button.styles';

interface ButtonProps {
  color: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  color,
  children,
  ariaLabel,
  onClick,
  leftIcon,
  rightIcon,
  type,
  isLoading,
  isDisabled
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
      type={type ? type : 'button'}
      disabled={isDisabled}
    >
      {leftIcon && leftIcon}
      <ButtonText primary={isPrimary}>{isLoading ? 'Loading...' : children}</ButtonText>
      {rightIcon && rightIcon}
    </ButtonContainer>
  );
};

export default Button;
