import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addLinkedTrip, updateLinkedTrip } from "../slice/linkedTripSlice";
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
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import UsersIcon from "../../../../assets/Users.svg?react";
import AttachmentsIcon from "../../../../assets/Attachments.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import InputAttachment from "../../../../components/Inputs/InputAttachment/InputAttachment";
import { convertFormDatesToString } from "../../../../utils/dateFunctions/dateFunctions";

// NOTE: ALL TRAIN DATA (see linkedTripSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)
//TODO: get URL from attachment upload to store as string[] in state slice instead of File[]

//TODO: FIX --> selected traveler label (z-index) overlapping start date calander

type LinkedTripFormData = z.infer<typeof linkedTripSchema>;

interface LinkedTripFormProps {
  linkedTripId?: string;
}

const LinkedTripForm: React.FC<LinkedTripFormProps> = ({ linkedTripId }) => {
  const dispatch = useDispatch();
  const existingLinkedTrip = useSelector((state: RootState) =>
    state.linkedTrip.linkedTrips.find((linkedTrip) => linkedTrip.id === linkedTripId)
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LinkedTripFormData>({
    resolver: zodResolver(linkedTripSchema),
  });

  useEffect(() => {
    if (existingLinkedTrip) {
      // Reset to todays date/time if remaining linkedTrip date/time is not present
      const convertedLinkedTrip = {
        ...existingLinkedTrip,
        startDate: existingLinkedTrip.startDate
          ? new Date(existingLinkedTrip.startDate)
          : new Date(),
        endDate: existingLinkedTrip.endDate
          ? new Date(existingLinkedTrip.endDate)
          : new Date()
      };

      reset(convertedLinkedTrip);
    } else {
      reset();
    }
  }, [existingLinkedTrip, reset]);
  const onSubmit = (data: LinkedTripFormData) => {
    // Convert the dates in the form data to ISO strings
    const convertedData = convertFormDatesToString(data);

    if (linkedTripId) {
      const updatedLinkedTrip = { ...existingLinkedTrip, ...convertedData, id: linkedTripId };
      console.log("Updated linkedTrip:", updatedLinkedTrip);
      dispatch(updateLinkedTrip(updatedLinkedTrip));
    } else {
      const newLinkedTrip = { id: uuidv4(), ...convertedData };
      console.log("New linkedTrip:", newLinkedTrip);
      dispatch(addLinkedTrip(newLinkedTrip));
    }
  };

  const options = [
    {
      value: "friendId1",
      label: "Hiren Bahri",
    },
    {
      value: "friendId2",
      label: "Ezra Watkins",
    },
    {
      value: "friendId3",
      label: "Lis Mcneal",
    },
  ];

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
                options={options}
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
        {!linkedTripId ? "Add Linked Trip" : "Update Linked Trip"}
      </Button>
    </FormContainer>
  );
};

export default LinkedTripForm;
