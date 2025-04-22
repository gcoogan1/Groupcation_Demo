import React from "react";
import FilterIcon from "@assets/Filter.svg?react";
import {
  HeaderText,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalSubmitContainer,
  ModalWrapper,
} from "./FiltersModal.styles";
import { theme } from "@styles/theme";
import CloseButton from "../CloseButton/CloseButton";
import Button from "../Button/Button";

interface FilterModalProps {
  openModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const FilterModal: React.FC<FilterModalProps> = ({
  openModal,
  onClose,
  onConfirm,
  children
}) => {
  if (!openModal) return null;

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ModalHeader>
          <FilterIcon color={theme.secondary} />
          <HeaderText>
            Filters
          </HeaderText>
          <CloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
        <ModalSubmitContainer>
          <Button color={"primary"} styles={{ width: "100%", background: `${theme.secondary}` }} ariaLabel={"confirm filters"} onClick={onConfirm}>Confirm Filters</Button>
        </ModalSubmitContainer>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default FilterModal;
