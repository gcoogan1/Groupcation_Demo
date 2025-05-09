import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  selectConvertedUsers,
  selectTrainById,
} from "@store/selectors/selectors";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
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
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelectCheckbox from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import RailwayIcon from "@assets/Train.svg?react";
import UsersIcon from "@assets/Users.svg?react";
import CostIcon from "@assets/Cost.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "@assets/Attachments.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputNumber from "@components/Inputs/InputNumber/InputNumber";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputAttachment from "@components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import {
  addTrainTable,
  deleteTrainTable,
  fetchTrainTable,
  updateTrainTable,
} from "../thunk/trainThunk";

// NOTE: ALL TRAIN DATA (see trainSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type TrainFormData = z.infer<typeof trainSchema>;

interface TrainFormProps {
  trainId?: string;
}

const TrainForm: React.FC<TrainFormProps> = ({ trainId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING TRAIN DATA FROM STATE IF ID PASSED
  const existingTrain = useSelector((state: RootState) =>
    selectTrainById(state, trainId)
  );

  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);

  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingTrain?.attachments && existingTrain.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingTrain?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingTrain?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingTrain?.cost; // something like "123.45"
    if (costString) {
      const num = Math.round(parseFloat(costString) * 100); // convert to cents
      return isNaN(num) ? 0 : num;
    }
    return 0;
  });
  const [travelers] = useState(users);
  const [isLoading, setIsLoading] = useState(false);

  // IF ALL DETAILS SHOWN, HIDE "ADD MORE DETAILS"
  const allDetailsShown = showCost && showAddNotes && showAttachments;

  // REACT-HOOK-FORM FUNCTIONS
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrainFormData>({
    resolver: zodResolver(trainSchema),
  });

  // WATCH DEPARTURE DATE FOR ARRIVAL MIN DATE
  const departureDate = watch("departureDate");

  // FETCH TRAIN DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (trainId) {
      dispatch(fetchTrainTable(trainId));
    }
  }, [dispatch, trainId]);

  // SET/CONVERT FORM IF EXISTING DATA
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

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingTrain.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingTrain, existingAttachments, reset]);

  // SUBMIT TRAIN FORM DATA
  const onSubmit = async (data: TrainFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE TRAIN
      if (trainId) {
        const updatedTrain = {
          ...existingTrain,
          ...rest,
          id: Number(existingTrain?.id),
        };

        await dispatch(
          updateTrainTable({
            train: updatedTrain,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD TRAIN
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addTrainTable({ train: newData, files: attachments, travelers })
        ).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save train:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
    try {
      if (trainId) await dispatch(deleteTrainTable(trainId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete train:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (trainId && !existingTrain) return <div>Loading...</div>;

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
                  minDate={departureDate ?? undefined}
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
              <InputSelectCheckbox
                label="Select Travelers"
                name="travelers"
                options={travelers}
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
                    setValue("cost", null);
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
          (!!showAttachments && !!existingAttachments)) && (
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
                  // Key tells React to completely re-render the component if the file names change, avoiding stale props
                  key={
                    existingTrain?.attachments
                      ?.map((a) => a.fileName)
                      .join(",") ?? "new"
                  }
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
                    setValue("notes", null);
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
        onClick={() => {}}
        color="primary"
        ariaLabel="submit"
        type="submit"
        isLoading={isLoading}
      >
        {!trainId ? "Add Train" : "Update Train"}
      </Button>
      {trainId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default TrainForm;
