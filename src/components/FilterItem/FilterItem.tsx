import { useState } from "react";
import Switch from "../Switch/Switch";
import CheckboxSelected from "../../assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "../../assets/Checkbox_Unselected.svg?react";

import {
  FilterItemContainer,
  FilterItemLabel,
  FilterItemText,
} from "./FilterItem.styles";

interface FilterItemProps {
  action: "checkbox" | "switch";
  icon: React.ReactNode;
  label: string;
  value: string;
  selected?: boolean;
  onToggle?: (value: string, selected: boolean) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  action,
  icon,
  label,
  value,
  selected = false,
  onToggle,
}) => {
  const [showBackground, setShowBackground] = useState(selected);

  const handleToggle = () => {
    const newState = !showBackground;
    setShowBackground(newState);
      /**
        Pass value (ex. "train") and its 
        new state (which is opposite of its prev state)
        to parent function (onToggle), if present
      */
    onToggle?.(value, newState);
  };
  

  return (
    <FilterItemContainer addBackground={showBackground} onClick={handleToggle}>
      <FilterItemLabel>
        {icon}
        <FilterItemText>{label}</FilterItemText>
      </FilterItemLabel>
      {action === "checkbox" ? (
        <>{showBackground ? <CheckboxSelected /> : <CheckboxUnselected />}</>
      ) : (
        <Switch onClick={handleToggle} />
      )}
    </FilterItemContainer>
  );
};

export default FilterItem;
