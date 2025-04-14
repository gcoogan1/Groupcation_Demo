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
  
  const handleToggle = () => {
      /**
        Pass value (ex. "train") and its 
        new state (which is opposite of its prev state)
        to parent function (onToggle), if present
      */
    onToggle?.(value, !selected);
  };
  

  return (
    <FilterItemContainer addBackground={selected} onClick={handleToggle}>
      <FilterItemLabel>
        {icon}
        <FilterItemText>{label}</FilterItemText>
      </FilterItemLabel>
      {action === "checkbox" ? (
        <>{selected ? <CheckboxSelected /> : <CheckboxUnselected />}</>
      ) : (
        <Switch onClick={handleToggle} />
      )}
    </FilterItemContainer>
  );
};

export default FilterItem;
