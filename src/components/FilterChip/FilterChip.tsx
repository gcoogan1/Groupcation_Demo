import Close from "../../assets/Cancel.svg?react"
import { theme } from "../../styles/theme";
import { CloseButtonWrapper, FilterChipContainer, FilterChipText } from "./FilterChip.styles";

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
      <CloseButtonWrapper onClick={onClick} >
      <Close color={theme.iconText} />
      </CloseButtonWrapper>
    </FilterChipContainer>
  )
}

export default FilterChip