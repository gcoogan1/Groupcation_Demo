/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  AttachmentContainer,
  AttachmentItem,
  AttachmentList,
  FileContainer,
  FileDeleteWrapper,
  FileIconWrapper,
  FileInput,
  FileName,
  FileSize,
} from "./InputAttachment.styles";
import { theme } from "@styles/theme";
import Button from "../../Button/Button";
import UploadIcon from "@assets/UploadFile.svg?react";
import DeleteIcon from "@assets/Delete.svg?react";
import FileIcon from "@assets/File.svg?react";
import { TrainAttachments } from "@tableTypes/trainTable.types";

interface InputAttachmentProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  name: string;
  defaultFiles?: TrainAttachments[];
}

const InputAttachment: React.FC<InputAttachmentProps> = ({
  register,
  setValue,
  name,
  defaultFiles = [],
}) => {
  const [uploadedFiles, setUploadedFiles] =
    useState<TrainAttachments[]>(defaultFiles);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Filter out any repeating files
      const newAttachments = selectedFiles
        .filter(
          (file) => !uploadedFiles.some((att) => att.fileName === file.name)
        )
        .map((file) => ({
          fileUrl: URL.createObjectURL(file), // Generate a temporary URL for preview
          fileType: file.type,
          fileSize: file.size,
          fileName: file.name,
          file, // Keep the original File object for any other processing
        }));

      const updatedFiles = [...uploadedFiles, ...newAttachments];
      setUploadedFiles(updatedFiles);
      setValue(name, updatedFiles); // Update form state with Attachments[]
    }

    // Reset to allow for file to be selected again (needed if file is deleted but added back later)
    event.target.value = "";
  };

  const handleFileDelete = (id: number | string) => {
    const updatedFiles = uploadedFiles.filter(
      (attachment) => attachment.id !== id
    );
    setUploadedFiles(updatedFiles);
    setValue(name, updatedFiles); // Update form state after deleting
  };

  return (
    <AttachmentContainer>
      {uploadedFiles.length > 0 && (
        <AttachmentList>
          {uploadedFiles.map((attachment, index) => (
            <AttachmentItem key={index}>
              <FileContainer>
                <FileIconWrapper>
                  <FileIcon />
                </FileIconWrapper>
                <div>
                  <FileName>{attachment.fileName}</FileName>{" "}
                  <FileSize>
                    {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                  </FileSize>
                </div>
              </FileContainer>
              <FileDeleteWrapper
                onClick={() => handleFileDelete(attachment.id!)}
              >
                <DeleteIcon />
              </FileDeleteWrapper>
            </AttachmentItem>
          ))}
        </AttachmentList>
      )}
      <Button
        color={"tertiary"}
        leftIcon={<UploadIcon color={theme.secondary} />}
        ariaLabel={"File upload"}
        onClick={() => fileInput.current?.click()}
      >
        Select File to Upload
      </Button>
      <FileInput
        type="file"
        {...register(name)}
        onChange={handleFileChange}
        multiple
        ref={fileInput}
      />
    </AttachmentContainer>
  );
};

export default InputAttachment;
