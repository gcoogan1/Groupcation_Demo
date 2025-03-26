import React, { useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addNote, updateNote } from "../slice/noteSlice";
import { NoteSchema } from "../schema/noteSchema";
import { z } from "zod";
import {
  ContentTitle,
  ContentTitleContainer,
  FormContainer,
  FormSections,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./NoteForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import Button from "../../../../components/Button/Button";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import InputTextArea from "../../../../components/Inputs/InputTextArea/InputTextArea";

// NOTE: ALL WALKING DATA (see NoteSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type NoteFormData = z.infer<typeof NoteSchema>;

interface NoteFormProps {
  noteId?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ noteId }) => {
  const dispatch = useDispatch();
  const existingNote = useSelector((state: RootState) =>
    state.note.notes.find((note) => note.id === noteId)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
  });

  useEffect(() => {
    if (existingNote) {
      reset(existingNote);
    } else {
      reset();
    }
  }, [existingNote, reset]);

  const onSubmit = (data: NoteFormData) => {
    if (noteId) {
      const updatedNote = { ...existingNote, ...data, id: noteId };
      console.log("Updated Note:", updatedNote);
      dispatch(updateNote(updatedNote));
    } else {
      const newNote = { id: uuidv4(), ...data };
      console.log("New Note:", newNote);
      dispatch(addNote(newNote));
    }
  };

  return (
    <FormContainer
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <FormSections>
        <Section>
          <SectionGraphics>
            <AddNotesIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Content</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.noteTitle}
                register={register}
                label={"Note Title"}
                name={"noteTitle"}
                placeholder="Title of note"
              />
              <InputTextArea
                register={register}
                label="Note Content"
                name={"noteContent"}
                placeholder="Enter main content of note..."
                error={errors.noteContent}
              />
            </SectionInputs>
          </SectionContents>
        </Section>
      </FormSections>
      <Button
        rightIcon={<ChevRight color={theme.base} />}
        onClick={() => console.log("reset form or close to homepage")}
        color="primary"
        ariaLabel="submit"
        type="submit"
      >
        {!noteId ? "Add Note" : "Update Note"}
      </Button>
    </FormContainer>
  );
};

export default NoteForm;
