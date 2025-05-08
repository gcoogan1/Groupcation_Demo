/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CostIcon from "@assets/Cost.svg?react";
import AttachmentIcon from "@assets/Attachments.svg?react";
import UserIcon from "@assets/Users.svg?react";
import NotesIcon from "@assets/AdditionalNotes.svg?react";
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
  ModalUserContent,
  ModalWrapper,
  User,
  UserContent,
  UserList,
  UserName,
  UserRelationship,
} from "./Modal.styles";
import { theme } from "@styles/theme";
import CloseButton from "../CloseButton/CloseButton";
import { transformToCamelCase } from "@utils/conversionFunctions/conversionFunctions";
import Avatar from "../Avatar/Avatar";
import { TravelerUIInfo } from "@/tableTypes/filter.types";



interface ModalProps {
  openModal: { open: boolean; type: string | null; travelers?: TravelerUIInfo[] };
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

  // Dynamically change icon based on type
  const typeToIcon: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    cost: CostIcon,
    attachments: AttachmentIcon,
    notes: NotesIcon,
    travelers: UserIcon,
  };
  const IconComponent = openModal.type ? typeToIcon[openModal.type] : null;
  

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
          {IconComponent && <IconComponent color={theme.secondary} />}
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
                            <AttachmentIcon />
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
          {openModal.type === "travelers" && (
            <ModalUserContent>
              {(openModal.travelers && openModal.travelers?.length <= 0) ? (
                <>
                  <ModalCostHeader>No Travelers have been added.</ModalCostHeader>
                </>
              ) : (
                <UserList>
                  {openModal.travelers?.map(traveler => {
                    return (
                      <User key={traveler.travelerFullName}>
                        <UserContent>
                          <Avatar initials={traveler.initials} color={traveler.color} />
                          <UserName>{traveler.travelerFullName}</UserName>
                          <UserRelationship>{traveler.relationshipToCreator}</UserRelationship>
                        </UserContent>
                      </User>
                    )
                  })}
                </UserList>
              )}
            </ModalUserContent>
          )}
        </ModalBody>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;
