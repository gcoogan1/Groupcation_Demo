import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addTrain, updateTrain } from "../slice/trainSlice";
import { trainSchema } from "../schema/trainSchema";
import { z } from "zod";
import {
  AddDetailsButtonContainer,
  AddMoreGraphicsLine,
  AddMoreSectionContents,
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
} from "./TrainForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import RailwayIcon from "../../../../assets/Train.svg?react";
import UsersIcon from "../../../../assets/Users.svg?react";
import CostIcon from "../../../../assets/Cost.svg?react";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "../../../../assets/Attachments.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import InputNumber from "../../../../components/Inputs/InputNumber/InputNumber";
import RemoveButton from "../../../../components/RemoveButton/RemoveButton";
import InputAttachment from "../../../../components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "../../../../components/Inputs/InputTextArea/InputTextArea";
import { convertFormDatesToString } from "../../../../utils/dateFunctions/dateFunctions";

// NOTE: ALL TRAIN DATA (see trainSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)
//TODO: get URL from attachments upload to store as string[] in state slice instead of File[]

type TrainFormData = z.infer<typeof trainSchema>;

interface TrainFormProps {
  trainId?: string;
}

const TrainForm: React.FC<TrainFormProps> = ({ trainId }) => {
  const dispatch = useDispatch();
  const existingTrain = useSelector((state: RootState) =>
    state.train.trains.find((train) => train.id === trainId)
  );
  const [showCost, setShowCost] = useState(!!existingTrain?.cost);
  const [showAttachments, setShowAttachments] = useState(
    !!existingTrain?.attachments
  );
  const [showAddNotes, setShowAddNotes] = useState(!!existingTrain?.notes);
  const [amount, setAmount] = useState(0);

  const allDetailsShown = showCost && showAddNotes && showAttachments;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TrainFormData>({
    resolver: zodResolver(trainSchema),
  });

  useEffect(() => {
    if (existingTrain) {
      // Reset to todays date/time if remaining train date/time is not present
      const convertedTrain = {
        ...existingTrain,
        departureDate: existingTrain.departureDate
          ? new Date(existingTrain.departureDate)
          : new Date(),
        arrivalDate: existingTrain.arrivalDate
          ? new Date(existingTrain.arrivalDate)
          : new Date(),
        departureTime: existingTrain.departureTime
          ? new Date(existingTrain.departureTime)
          : new Date(),
        arrivalTime: existingTrain.arrivalTime
          ? new Date(existingTrain.arrivalTime)
          : new Date(),
      };

      reset(convertedTrain);
    } else {
      reset();
    }
  }, [existingTrain, reset]);
  const onSubmit = (data: TrainFormData) => {
    // Convert the dates in the form data to ISO strings
    const convertedData = convertFormDatesToString(data);

    if (trainId) {
      const updatedTrain = { ...existingTrain, ...convertedData, id: trainId };
      console.log("Updated train:", updatedTrain);
      dispatch(updateTrain(updatedTrain));
    } else {
      const newTrain = { id: uuidv4(), ...convertedData };
      console.log("New train:", newTrain);
      dispatch(addTrain(newTrain));
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
              <ContentTitle>Departure</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.departureStation}
                register={register}
                label={"Station"}
                name={"departureStation"}
                placeholder="Enter name of train station"
              />
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.departureDate}
                  label={"Date"}
                  name={"departureDate"}
                />
                <InputTime
                  control={control}
                  error={errors.departureTime}
                  label={"Time"}
                  name={"departureTime"}
                />
              </InputDatesRow>
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
              <ContentTitle>Arrival</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.arrivalStation}
                register={register}
                label={"Station"}
                name={"arrivalStation"}
                placeholder="Enter name of train station"
              />
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.arrivalDate}
                  label={"Date"}
                  name={"arrivalDate"}
                />
                <InputTime
                  control={control}
                  error={errors.arrivalTime}
                  label={"Time"}
                  name={"arrivalTime"}
                />
              </InputDatesRow>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <RailwayIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Railway</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.railwayLine}
                register={register}
                label={"Train Line"}
                name={"railwayLine"}
                placeholder="Enter name of the train line"
              />
              <InputText
                error={errors.class}
                register={register}
                label={"Class"}
                name={"class"}
                placeholder="Enter a class name for this journey"
              />
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
        {(!!showCost || (!!showCost && !!existingTrain?.cost)) && (
          <Section>
            <SectionGraphics>
              <CostIcon color={theme.iconText} />
              <SectionGraphicsLine />
            </SectionGraphics>
            <SectionContents>
              <ContentTitleContainer>
                <ContentTitle>Cost</ContentTitle>
                <RemoveButton
                  onRemove={() => {
                    setShowCost(false);
                    setValue("cost", undefined);
                  }}
                />
              </ContentTitleContainer>
              <SectionInputs>
                <InputNumber
                  register={register}
                  label={"Total Cost"}
                  name={"cost"}
                  value={amount}
                  onChange={(val) => setAmount(val)}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAttachments ||
          (!!showAttachments && !!existingTrain?.attachments)) && (
          <Section>
            <SectionGraphics>
              <AttachmentsIcon color={theme.iconText} />
              <SectionGraphicsLine />
            </SectionGraphics>
            <SectionContents>
              <ContentTitleContainer>
                <ContentTitle>Attachments</ContentTitle>
                <RemoveButton
                  onRemove={() => {
                    setShowAttachments(false);
                    setValue("attachments", undefined);
                  }}
                />
              </ContentTitleContainer>
              <SectionInputs>
                <InputAttachment
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingTrain?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingTrain?.notes)) && (
          <Section>
            <SectionGraphics>
              <AddNotesIcon color={theme.iconText} />
              <SectionGraphicsLine />
            </SectionGraphics>
            <SectionContents>
              <ContentTitleContainer>
                <ContentTitle>Additional Notes</ContentTitle>
                <RemoveButton
                  onRemove={() => {
                    setShowAddNotes(false);
                    setValue("notes", undefined);
                  }}
                />
              </ContentTitleContainer>
              <SectionInputs>
                <InputTextArea
                  register={register}
                  label="Notes"
                  name={"notes"}
                  placeholder="Enter any extra pieces of information..."
                  error={errors.notes}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        <Section>
          <SectionGraphics>
            <AddMoreGraphicsLine />
          </SectionGraphics>
          {!allDetailsShown && (
            <AddMoreSectionContents>
              <ContentTitleContainer>
                <ContentTitle>Add More Details</ContentTitle>
              </ContentTitleContainer>
              <AddDetailsButtonContainer>
                {!showCost && (
                  <Button
                    type="button"
                    color="tertiary"
                    ariaLabel="add cost"
                    onClick={() => setShowCost(true)}
                    leftIcon={<CostIcon color={theme.iconText} />}
                  >
                    Cost
                  </Button>
                )}
                {!showAddNotes && (
                  <Button
                    type="button"
                    color="tertiary"
                    ariaLabel="add notes"
                    onClick={() => setShowAddNotes(true)}
                    leftIcon={<AddNotesIcon color={theme.iconText} />}
                  >
                    Additional Notes
                  </Button>
                )}
                {!showAttachments && (
                  <Button
                    type="button"
                    color="tertiary"
                    ariaLabel="add attachments"
                    onClick={() => setShowAttachments(true)}
                    leftIcon={<AttachmentsIcon color={theme.iconText} />}
                  >
                    Attachments
                  </Button>
                )}
              </AddDetailsButtonContainer>
            </AddMoreSectionContents>
          )}
        </Section>
      </FormSections>
      <Button
        rightIcon={<ChevRight color={theme.base} />}
        onClick={() => console.log("reset form or close to homepage")}
        color="primary"
        ariaLabel="submit"
        type="submit"
      >
        {!trainId ? "Add Train" : "Update Train"}
      </Button>
    </FormContainer>
  );
};

export default TrainForm;
