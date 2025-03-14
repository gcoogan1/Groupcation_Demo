import { MenuItemContainer, MenuItemText } from "./MenuItem.styles";

interface MenuItemProps {
  pictogram: React.ReactNode;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ pictogram, text }) => {
  return (
    <MenuItemContainer>
      {pictogram}
      <MenuItemText>
        {text}
      </MenuItemText>
    </MenuItemContainer>
  )
}

export default MenuItem;