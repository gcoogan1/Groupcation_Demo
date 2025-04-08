import React from "react";
import CostIcon from "../../assets/Cost.svg?react";
import FileIcon from "../../assets/File.svg?react";
import {
  FileContainer,
  FileIconWrapper,
  FileName,
  FileSize,
  HeaderText,
  ModalAttachmentItem,
  ModalAttachmentsList,
  ModalBody,
  ModalContent,
  ModalCostContent,
  ModalCostHeader,
  ModalHeader,
  ModalOverlay,
  ModalWrapper,
} from "./Modal.styles";
import { theme } from "../../styles/theme";
import CloseButton from "../CloseButton/CloseButton";
import { transformToCamelCase } from "../../utils/conversionFunctions/conversionFunctions";

interface ModalProps {
  openModal: { open: boolean; type: string | null };
  onClose: () => void;
  cost?: string;
  attachments?: any[];
  notes?: string;
}

const Modal: React.FC<ModalProps> = ({
  openModal,
  onClose,
  cost,
  attachments,
  notes,
}) => {
  if (!openModal.open) return null;

  const formatedAttachments = attachments
    ? attachments.map((att) => transformToCamelCase(att))
    : [];
  const handleOpenFile = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ModalHeader>
          <CostIcon color={theme.secondary} />
          <HeaderText>
            {openModal.type === "notes"
              ? `Additional ${openModal.type}`
              : openModal.type}
          </HeaderText>
          <CloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody>
          {openModal.type === "cost" && (
            <ModalContent>
              {!cost ? (
                <>
                  <ModalCostHeader>No cost has been added.</ModalCostHeader>
                </>
              ) : (
                <>
                  <ModalCostHeader>Total Cost:</ModalCostHeader>
                  <ModalCostContent>{`$${cost}`}</ModalCostContent>
                </>
              )}
            </ModalContent>
          )}
          {openModal.type === "attachments" && (
            <>
              {attachments && attachments?.length > 0 ? (
                <ModalAttachmentsList>
                  {formatedAttachments?.map((attachment) => {
                    return (
                      <ModalAttachmentItem
                        key={attachment.fileUrl}
                        onClick={() => handleOpenFile(attachment.fileUrl)}
                      >
                        <FileContainer>
                          <FileIconWrapper>
                            <FileIcon />
                          </FileIconWrapper>
                          <div>
                            <FileName>{attachment.fileName}</FileName>{" "}
                            <FileSize>
                              {(attachment.fileSize / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </FileSize>
                          </div>
                        </FileContainer>
                      </ModalAttachmentItem>
                    );
                  })}
                </ModalAttachmentsList>
              ) : (
                <ModalContent>
                  <ModalCostHeader>
                    No attachments have been added.
                  </ModalCostHeader>
                </ModalContent>
              )}
            </>
          )}
          {openModal.type === "notes" && (
            <ModalContent>
              {!notes ? (
                <ModalCostHeader>No notes have been added.</ModalCostHeader>
              ) : (
                <ModalCostHeader>{notes}</ModalCostHeader>
              )}
            </ModalContent>
          )}
        </ModalBody>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;
