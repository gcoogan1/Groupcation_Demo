import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { boatSchema } from "../schema/boatSchema";
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
} from "./BoatForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import BoatIcon from "@assets/Boat.svg?react";
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
  addBoatTable,
  deleteBoatTable,
  fetchBoatTable,
  updateBoatTable,
} from "../thunk/boatThunk";


type BoatFormData = z.infer<typeof boatSchema>;

interface BoatFormProps {
  boatId?: string;
}

const BoatForm: React.FC<BoatFormProps> = ({ boatId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING BOAT DATA FROM STATE IF ID PASSED
  const existingBoat = useSelector((state: RootState) =>
    state.boat.boats.find((boat) => boat.id === boatId)
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingBoat?.attachments && existingBoat.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingBoat?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingBoat?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingBoat?.cost;
    if (costString) {
      const num = Math.round(parseFloat(costString) * 100);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  });
  const [travelers, setTravelers] = useState(users);
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
  } = useForm<BoatFormData>({
    resolver: zodResolver(boatSchema),
  });

   // WATCH DEPARTURE DATE FOR ARRIVAL MIN DATE
  const departureDate = watch("departureDate");

  // FETCH BOAT DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (boatId) {
      dispatch(fetchBoatTable(boatId));
    }
  }, [dispatch, boatId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingBoat) {
      // Reset to todays date/time if remaining boat date/time is not present
      const convertedBoat = {
        ...existingBoat,
        departureDate: existingBoat.departureDate
          ? new Date(existingBoat.departureDate)
          : new Date(),
        arrivalDate: existingBoat.arrivalDate
          ? new Date(existingBoat.arrivalDate)
          : new Date(),
        departureTime: existingBoat.departureTime
          ? new Date(existingBoat.departureTime)
          : new Date(),
        arrivalTime: existingBoat.arrivalTime
          ? new Date(existingBoat.arrivalTime)
          : new Date(),
      };

      reset(convertedBoat);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingBoat.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingBoat, existingAttachments, reset]);

  // SUBMIT BOAT FORM DATA
  const onSubmit = async (data: BoatFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE BOAT
      if (boatId) {
        const updatedBoat = {
          ...existingBoat,
          ...rest,
          id: Number(existingBoat?.id),
        };

        await dispatch(
          updateBoatTable({
            boat: updatedBoat,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD BOAT
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addBoatTable({ boat: newData, files: attachments, travelers })
        ).unwrap();
      }

      navigate("/");
    } catch (error) {
      console.error("Failed to save boat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
      try {
        if (boatId) await dispatch(deleteBoatTable(boatId)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Failed to delete boat:", error);
      } finally {
        setIsLoading(false);
      }
    };

  if (boatId && !existingBoat) return <div>Loading...</div>

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
                error={errors.departureDock}
                register={register}
                label={"Departure Dock"}
                name={"departureDock"}
                placeholder="Enter name of dock"
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
                error={errors.arrivalDock}
                register={register}
                label={"Arrival Dock"}
                name={"arrivalDock"}
                placeholder="Enter name of dock"
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
            <BoatIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Fleet</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.boatCruiseLine}
                register={register}
                label={"Boat / Cruise Line"}
                name={"boatCruiseLine"}
                placeholder="Enter name of the boat / cruise line"
              />
              <InputText
                error={errors.boatCruiseClass}
                register={register}
                label={"Class"}
                name={"boatCruiseClass"}
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
                options={travelers}
                placeholder="Choose your companions..."
                control={control}
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        {(!!showCost || (!!showCost && !!existingBoat?.cost)) && (
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
                  key={existingBoat?.attachments?.map((a) => a.fileName).join(",") ?? "new"}
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingBoat?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingBoat?.notes)) && (
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
        {!boatId ? "Add Boat" : "Update Boat"}
      </Button>
      {boatId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default BoatForm;
