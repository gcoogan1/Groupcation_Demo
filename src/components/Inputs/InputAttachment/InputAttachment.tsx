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

const FileUpload: React.FC = () => {
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const fileInput = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const selectedFiles = Array.from(event.target.files);
			setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
		}
	};

  const handleFileDelete = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.name !== fileName);
    setUploadedFiles(updatedFiles);
  }

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
								<FileSize>25 MB</FileSize></div>
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
				onChange={handleFileChange}
				multiple
				ref={fileInput}
			/>
		</AttachmentContainer>
	);
};

export default FileUpload;
