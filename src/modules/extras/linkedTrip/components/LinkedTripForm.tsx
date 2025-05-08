/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { linkedTripSchema } from "../schema/linkedTripSchema";
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
} from "./LinkedTripForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import UsersIcon from "@assets/Users.svg?react";
import AttachmentsIcon from "@assets/Attachments.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputAttachment from "@components/Inputs/InputAttachment/InputAttachment";
import { useNavigate } from "react-router-dom";
import { selectConvertedUsers } from "@/store/selectors/selectors";
import {
  addLinkedTripTable,
  deleteLinkedTripTable,
  fetchLinkedTripTable,
  updateLinkedTripTable,
} from "../thunk/linkedTripThunk";

// NOTE: ALL LINKED TRIP DATA (see linkedTripSchema) MUST BE PRESENT FOR SUBMIT TO WORK

//TODO: FIX --> selected traveler label (z-index) overlapping start date calander

type LinkedTripFormData = z.infer<typeof linkedTripSchema>;

interface LinkedTripFormProps {
  linkedTripId?: string;
}

const LinkedTripForm: React.FC<LinkedTripFormProps> = ({ linkedTripId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING LINKED TRIP DATA FROM STATE IF ID PASSED
  const existingLinkedTrip = useSelector((state: RootState) =>
    state.linkedTrip.linkedTrips.find(
      (linkedTrip) => linkedTrip.id === linkedTripId
    )
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingLinkedTrip?.attachments &&
    existingLinkedTrip.attachments.length > 0;

  // FORM STATE
  const [travelers, setTravelers] = useState(users);
  const [isLoading, setIsLoading] = useState(false);

  // REACT-HOOK-FORM FUNCTIONS
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LinkedTripFormData>({
    resolver: zodResolver(linkedTripSchema),
  });

  // WATCH START DATE FOR END MIN DATE
  const startDate = watch("startDate");

  // FETCH LINKED TRIP DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (linkedTripId) {
      dispatch(fetchLinkedTripTable(linkedTripId));
    }
  }, [dispatch, linkedTripId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingLinkedTrip) {
      // Reset to todays date/time if remaining train date/time is not present
      const convertedLinkedTrip = {
        ...existingLinkedTrip,
        startDate: existingLinkedTrip.startDate
          ? new Date(existingLinkedTrip.startDate)
          : new Date(),
        endDate: existingLinkedTrip.endDate
          ? new Date(existingLinkedTrip.endDate)
          : new Date(),
      };
      reset(convertedLinkedTrip);
    } else {
      reset();
    }
  }, [existingLinkedTrip, existingAttachments, reset]);

  // SUBMIT LINKED TRIP FORM DATA
  const onSubmit = async (data: LinkedTripFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);
    console.log("data submit linked trip:", data);

    try {
      // UPDATE LINKED TRIP
      if (linkedTripId) {
        const updatedLinkedTrip = {
          ...existingLinkedTrip,
          ...rest,
          id: Number(existingLinkedTrip?.id),
        };

        await dispatch(
          updateLinkedTripTable({
            linkedTrip: updatedLinkedTrip,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD LINKED TRIP
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addLinkedTripTable({
            linkedTrip: newData,
            files: attachments,
            travelers,
          })
        ).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save linked trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
    try {
      if (linkedTripId)
        await dispatch(deleteLinkedTripTable(linkedTripId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete linked trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (linkedTripId && !existingLinkedTrip) return <div>Loading...</div>;

  return (
    <FormContainer
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <FormSections>
        <Section>
          <SectionGraphics>
            <StartIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Title</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.linkedTripTitle}
                register={register}
                label={"Name of Trip"}
                name={"linkedTripTitle"}
                placeholder="Enter name of the trip"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <EndIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Duration</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.startDate}
                  label={"Start Date"}
                  name={"startDate"}
                />
                <InputDate
                  control={control}
                  error={errors.endDate}
                  label={"End Date"}
                  name={"endDate"}
                  minDate={
                    startDate
                      ? new Date(
                          new Date(startDate).setDate(
                            new Date(startDate).getDate() + 1
                          )
                        )
                      : undefined
                  }
                />
              </InputDatesRow>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <UsersIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Travelers</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputSelect
                label="Select Travelers"
                name="travelers"
                options={travelers}
                placeholder="Choose your companions..."
                control={control}
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <AttachmentsIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Background Photo</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputAttachment
                register={register}
                setValue={setValue}
                name={"attachments"}
                defaultFiles={existingLinkedTrip?.attachments || []}
                allowMultiple={false}
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
        isLoading={isLoading}
      >
        {!linkedTripId ? "Add Linked Trip" : "Update Linked Trip"}
      </Button>
      {linkedTripId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default LinkedTripForm;
