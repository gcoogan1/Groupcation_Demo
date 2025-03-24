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
import InputSelect from "../../../../components/Inputs/InputSelect/InputSelect";
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

// NOTE: ALL TRAIN DATA (see trainSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)

type TrainFormData = z.infer<typeof trainSchema>;

interface TrainFormProps {
  trainId?: string;
}

const TrainForm: React.FC<TrainFormProps> = ({ trainId }) => {
  const dispatch = useDispatch();
  const [showCost, setShowCost] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [amount, setAmount] = useState(0);
  const existingTrain = useSelector((state: RootState) =>
    state.train.trains.find((train) => train.id === trainId)
  );

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
      reset({
        ...existingTrain,
        departureDate: existingTrain.departureDate ? new Date(existingTrain?.departureDate) : new Date(),
        arrivalDate: existingTrain.arrivalDate ? new Date(existingTrain?.arrivalDate): new Date(),
      });
    } else {
      reset();
    }
  }, [existingTrain, reset]);

  const onSubmit = (data: TrainFormData) => {
    if (trainId) {
      const updatedTrain = { ...existingTrain, ...data, id: trainId };
      console.log("Updated train:", updatedTrain)
      dispatch(updateTrain(updatedTrain));
    } else {
      const newTrain = { id: uuidv4(), ...data };
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
        {(!!showCost || !!existingTrain?.cost) && (
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
                    setValue("cost", "");
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
        {(!!showAttachments || !!existingTrain?.attachments) && (
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
                    setValue("attachments", []);
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
        {(!!showAddNotes || !!existingTrain?.notes) && (
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
                    setValue("notes", "");
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
          <AddMoreSectionContents>
            <ContentTitleContainer>
              <ContentTitle>Add More Details</ContentTitle>
            </ContentTitleContainer>
            <AddDetailsButtonContainer>
              <Button
                type="button"
                color="tertiary"
                ariaLabel="add cost"
                onClick={() => setShowCost(true)}
                leftIcon={<CostIcon color={theme.iconText} />}
              >
                Cost
              </Button>
              <Button
                type="button"
                color="tertiary"
                ariaLabel="add notes"
                onClick={() => setShowAddNotes(true)}
                leftIcon={<AddNotesIcon color={theme.iconText} />}
              >
                Additional Notes
              </Button>
              <Button
                type="button"
                color="tertiary"
                ariaLabel="add attachments"
                onClick={() => setShowAttachments(true)}
                leftIcon={<AttachmentsIcon color={theme.iconText} />}
              >
                Attachments
              </Button>
            </AddDetailsButtonContainer>
          </AddMoreSectionContents>
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
