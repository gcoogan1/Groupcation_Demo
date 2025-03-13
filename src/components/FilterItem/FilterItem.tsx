import { useState } from "react";
import Switch from "../Switch/Switch";
import CheckboxSelected from "../../assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "../../assets/Checkbox_Unselected.svg?react";

import { FilterItemContainer, FilterItemLabel, FilterItemText } from "./FilterItem.styles";

interface FilterItemProps {
  action: "checkbox" | "switch";
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
}

const FilterItem: React.FC<FilterItemProps> = ({ action, icon, label, selected = false }) => {
  const [showBackground, setShowBackground] = useState(selected)

  const handleToggle = () => {
    setShowBackground((prev) => !prev);
  };

  return (
    <FilterItemContainer addBackground={showBackground} onClick={handleToggle}>
      <FilterItemLabel>
        {icon}
        <FilterItemText>
          {label}
        </FilterItemText>
      </FilterItemLabel>
      {(action === 'checkbox') ? (
        <>
        {showBackground ? <CheckboxSelected /> : <CheckboxUnselected />}
        </>
      ) : (
        <Switch onClick={handleToggle} />
      )}
    </FilterItemContainer>
  )
}

export default FilterItem