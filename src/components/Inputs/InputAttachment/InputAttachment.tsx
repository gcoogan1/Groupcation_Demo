/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
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
import { theme } from "../../../styles/theme";
import Button from "../../Button/Button";
import UploadIcon from "../../../assets/UploadFile.svg?react";
import DeleteIcon from "../../../assets/Delete.svg?react";
import FileIcon from "../../../assets/File.svg?react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface InputAttachmentProps {
	register: UseFormRegister<any>;
	setValue: UseFormSetValue<any>;
	name: string;
	defaultFiles?: File[];
}

const InputAttachment: React.FC<InputAttachmentProps> = ({
	register,
	setValue,
	name,
	defaultFiles = [],
}) => {
	const [uploadedFiles, setUploadedFiles] = useState<File[]>(defaultFiles);
	const fileInput = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const selectedFiles = Array.from(event.target.files);
			const newFiles = [...uploadedFiles, ...selectedFiles];
			setUploadedFiles(newFiles);
			setValue(name, newFiles); // Update form state with selected files
		}
	};

	const handleFileDelete = (fileName: string) => {
		const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
		setUploadedFiles(updatedFiles);
		setValue(name, updatedFiles); // Update form state after deleting
	};

	return (
		<AttachmentContainer>
			{uploadedFiles.length > 0 && (
				<AttachmentList>
					{uploadedFiles.map((file, index) => (
						<AttachmentItem key={index}>
							<FileContainer>
								<FileIconWrapper>
									<FileIcon />
								</FileIconWrapper>
								<div>
									<FileName>{file.name}</FileName>
									<FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
								</div>
							</FileContainer>
							<FileDeleteWrapper onClick={() => handleFileDelete(file.name)}>
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
