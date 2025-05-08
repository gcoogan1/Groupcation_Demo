import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { celebrationSchema } from "../schema/celebrationSchema";
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
} from "./CelebrationForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import CelebrationIcon from "@assets/Celebration.svg?react";
import UsersIcon from "@assets/Users.svg?react";
import CostIcon from "@assets/Cost.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "@assets/Attachments.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputNumber from "@components/Inputs/InputNumber/InputNumber";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputAttachment from "@components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import { useNavigate } from "react-router-dom";
import { selectConvertedUsers } from "@store/selectors/selectors";
import {
  addCelebrationTable,
  deleteCelebrationTable,
  fetchCelebrationTable,
  updateCelebrationTable,
} from "../thunk/celebrationThunk";

type CelebrationFormData = z.infer<typeof celebrationSchema>;

interface CelebrationFormProps {
  celebrationId?: string;
}

const CelebrationForm: React.FC<CelebrationFormProps> = ({ celebrationId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING CELEBRATION DATA FROM STATE IF ID PASSED
  const existingCelebration = useSelector((state: RootState) =>
    state.celebration.celebrations.find(
      (celebration) => celebration.id === celebrationId
    )
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingCelebration?.attachments &&
    existingCelebration.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingCelebration?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(
    !!existingCelebration?.notes
  );
  const [amount, setAmount] = useState(() => {
    const costString = existingCelebration?.cost;
    if (costString) {
      const num = Math.round(parseFloat(costString) * 100);
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
  } = useForm<CelebrationFormData>({
    resolver: zodResolver(celebrationSchema),
  });

  // WATCH START DATE FOR END MIN DATE
  const startDate = watch("startDate");

  // FETCH CELEBRATION DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (celebrationId) {
      dispatch(fetchCelebrationTable(celebrationId));
    }
  }, [dispatch, celebrationId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingCelebration) {
      // Reset to todays date/time if remaining celebration date/time is not present
      const convertedCelebration = {
        ...existingCelebration,
        startDate: existingCelebration.startDate
          ? new Date(existingCelebration.startDate)
          : new Date(),
        endDate: existingCelebration.endDate
          ? new Date(existingCelebration.endDate)
          : new Date(),
        startTime: existingCelebration.startTime
          ? new Date(existingCelebration.startTime)
          : new Date(),
        endTime: existingCelebration.endTime
          ? new Date(existingCelebration.endTime)
          : new Date(),
      };

      reset(convertedCelebration);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingCelebration.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingCelebration, existingAttachments, reset]);

  // SUBMIT CELEBRATION FORM DATA
  const onSubmit = async (data: CelebrationFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE CELEBRATION
      if (celebrationId) {
        const updatedCelebration = {
          ...existingCelebration,
          ...rest,
          id: Number(existingCelebration?.id),
        };

        await dispatch(
          updateCelebrationTable({
            celebration: updatedCelebration,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD CELEBRATION
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addCelebrationTable({
            celebration: newData,
            files: attachments,
            travelers,
          })
        ).unwrap();
      }

      navigate("/");
    } catch (error) {
      console.error("Failed to save celebration:", error);
    } finally {
      setIsLoading(false);
    }
  };

    const deleteTable = async () => {
      try {
        if (celebrationId) await dispatch(deleteCelebrationTable(celebrationId)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Failed to delete celebration:", error);
      } finally {
        setIsLoading(false);
      }
    };

  if (celebrationId && !existingCelebration) return <div>Loading...</div>;

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
              <ContentTitle>Location</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.celebrationName}
                register={register}
                label={"Name of Celebration"}
                name={"celebrationName"}
                placeholder="Enter name of the celebration"
              />
              <InputText
                error={errors.celebrationLocation}
                register={register}
                label={"Location"}
                name={"celebrationLocation"}
                placeholder="Enter address for the celebration"
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
              <ContentTitle>Timing</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.startDate}
                  label={"Start Date"}
                  name={"startDate"}
                />
                <InputTime
                  control={control}
                  error={errors.startTime}
                  label={"Start Time"}
                  name={"startTime"}
                />
              </InputDatesRow>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.endDate}
                  label={"End Date"}
                  name={"endDate"}
                  minDate={startDate ?? undefined}
                />
                <InputTime
                  control={control}
                  error={errors.endTime}
                  label={"End Time"}
                  name={"endTime"}
                />
              </InputDatesRow>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <CelebrationIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Celebration</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.celebrationType}
                register={register}
                label={"Celebration Type"}
                name={"celebrationType"}
                placeholder="Enter type of celebration"
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
                options={travelers}
                placeholder="Choose your companions..."
                control={control}
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        {(!!showCost || (!!showCost && !!existingCelebration?.cost)) && (
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
                  key={
                    existingCelebration?.attachments
                      ?.map((a) => a.fileName)
                      .join(",") ?? "new"
                  }
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingCelebration?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes ||
          (!!showAddNotes && !!existingCelebration?.notes)) && (
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
        onClick={() => console.log("reset form or close to homepage")}
        color="primary"
        ariaLabel="submit"
        type="submit"
        isLoading={isLoading}
      >
        {!celebrationId ? "Add Celebration" : "Update Celebration"}
      </Button>
      {celebrationId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default CelebrationForm;
