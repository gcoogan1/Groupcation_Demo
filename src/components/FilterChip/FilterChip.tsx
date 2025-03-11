import CloseButton from "../CloseButton/CloseButton";
import { FilterChipContainer, FilterChipText } from "./FilterChip.styles";

interface FilterChipProps {
  filterText: string;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ filterText, onClick }) => {
  return (
    <FilterChipContainer>
      <FilterChipText>
        {filterText}
      </FilterChipText>
      <CloseButton onClose={onClick} />
    </FilterChipContainer>
  )
}

export default FilterChip