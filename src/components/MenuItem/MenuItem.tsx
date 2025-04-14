import { MenuItemContainer, MenuItemText } from "./MenuItem.styles";

interface MenuItemProps {
  pictogram: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ pictogram, text, onClick }) => {
  return (
    <MenuItemContainer onClick={onClick}>
      {pictogram}
      <MenuItemText>
        {text}
      </MenuItemText>
    </MenuItemContainer>
  )
}

export default MenuItem;