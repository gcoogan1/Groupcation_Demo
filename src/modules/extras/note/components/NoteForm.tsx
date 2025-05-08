import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { NoteSchema } from "../schema/noteSchema";
import { z } from "zod";
import {
  ContentTitle,
  ContentTitleContainer,
  FormContainer,
  FormSections,
  InputDatesRow,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./NoteForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import Button from "@components/Button/Button";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import DateIcon from "@assets/Date.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import { useNavigate } from "react-router-dom";
import {
  addNoteTable,
  deleteNoteTable,
  fetchNoteTable,
  updateNoteTable,
} from "../thunk/noteThunk";

// NOTE: ALL WALKING DATA (see NoteSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type NoteFormData = z.infer<typeof NoteSchema>;

interface NoteFormProps {
  noteId?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ noteId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING NOTE DATA FROM STATE IF ID PASSED
  const existingNote = useSelector((state: RootState) =>
    state.note.notes.find((note) => note.id === noteId)
  );

  const [isLoading, setIsLoading] = useState(false);

  // REACT-HOOK-FORM FUNCTIONS
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
  });

  // FETCH NOTE DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (noteId) {
      dispatch(fetchNoteTable(noteId));
    }
  }, [dispatch, noteId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingNote) {
      // Reset to todays date/time if remaining train date/time is not present
      const convertedTrain = {
        ...existingNote,
        startDate: existingNote.startDate
          ? new Date(existingNote.startDate)
          : new Date(),
        startTime: existingNote.startTime
          ? new Date(existingNote.startTime)
          : new Date(),
      };
      reset(convertedTrain);
    } else {
      reset();
    }
  }, [existingNote, reset]);

  // SUBMIT NOTE FORM DATA
  const onSubmit = async (data: NoteFormData) => {
    const { ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE NOTE
      if (noteId) {
        const updatedNote = {
          ...existingNote,
          ...rest,
          id: Number(existingNote?.id),
        };

        await dispatch(updateNoteTable({ note: updatedNote })).unwrap();
      } else {
        // ADD NOTE
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(addNoteTable({ note: newData })).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
    try {
      if (noteId) await dispatch(deleteNoteTable(noteId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (noteId && !existingNote) return <div>Loading...</div>;

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
        <Section>
          <SectionGraphics>
            <DateIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Date & Time</ContentTitle>
            </ContentTitleContainer>
            <InputDatesRow>
              <InputDate
                control={control}
                error={errors.startDate}
                label={"Date"}
                name={"startDate"}
              />
              <InputTime
                control={control}
                error={errors.startTime}
                label={"Time"}
                name={"startTime"}
              />
            </InputDatesRow>
          </SectionContents>
        </Section>
      </FormSections>
      <Button
        rightIcon={<ChevRight color={theme.base} />}
        onClick={() => console.log("reset form or close to homepage")}
        color="primary"
        ariaLabel="submit"
        type="submit"
        isLoading={isLoading}
      >
        {!noteId ? "Add Note" : "Update Note"}
      </Button>
      {noteId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default NoteForm;
