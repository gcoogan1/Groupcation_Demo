import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { busSchema } from "../schema/busSchema";
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
} from "./BusForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import BusIcon from "@assets/Bus.svg?react";
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
import {
  selectBusById,
  selectConvertedUsers,
} from "@store/selectors/selectors";
import { addBusTable, fetchBusTable, updateBusTable } from "../thunk/busThunk";

// NOTE: ALL BUS DATA (see busSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type BusFormData = z.infer<typeof busSchema>;

interface BusFormProps {
  busId?: string;
}

const BusForm: React.FC<BusFormProps> = ({ busId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING BUS DATA FROM STATE IF ID PASSED
  const existingBus = useSelector((state: RootState) =>
    selectBusById(state, busId)
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingBus?.attachments && existingBus.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingBus?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingBus?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingBus?.cost;
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
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
  });

  // WATCH DEPARTURE DATE FOR ARRIVAL MIN DATE
  const departureDate = watch("departureDate");

  // FETCH BUS DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (busId) {
      dispatch(fetchBusTable(busId));
    }
  }, [dispatch, busId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingBus) {
      // Reset to todays date/time if remaining bus date/time is not present
      const convertedBus = {
        ...existingBus,
        departureDate: existingBus.departureDate
          ? new Date(existingBus.departureDate)
          : new Date(),
        arrivalDate: existingBus.arrivalDate
          ? new Date(existingBus.arrivalDate)
          : new Date(),
        departureTime: existingBus.departureTime
          ? new Date(existingBus.departureTime)
          : new Date(),
        arrivalTime: existingBus.arrivalTime
          ? new Date(existingBus.arrivalTime)
          : new Date(),
      };

      reset(convertedBus);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingBus.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingBus, existingAttachments, reset]);

  const onSubmit = async (data: BusFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE TRAIN
      if (busId) {
        const updatedBus = {
          ...existingBus,
          ...rest,
          id: Number(existingBus?.id),
        };

        await dispatch(
          updateBusTable({
            bus: updatedBus,
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
          addBusTable({ bus: newData, files: attachments, travelers })
        ).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save bus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (busId && !existingBus) return <div>Loading...</div>;

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
                error={errors.departureBusStop}
                register={register}
                label={"Departure Bus Stop"}
                name={"departureBusStop"}
                placeholder="Enter name of bus stop"
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
                error={errors.arrivalBusStop}
                register={register}
                label={"Arrival Bus Stop"}
                name={"arrivalBusStop"}
                placeholder="Enter name of bus stop"
              />
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.arrivalDate}
                  label={"Date"}
                  name={"arrivalDate"}
                  minDate={departureDate ?? undefined}
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
            <BusIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Operator</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.busRoute}
                register={register}
                label={"Bus Route"}
                name={"busRoute"}
                placeholder="Enter name of the bus route"
              />
              <InputText
                error={errors.busClass}
                register={register}
                label={"Class"}
                name={"busClass"}
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
        {(!!showCost || (!!showCost && !!existingBus?.cost)) && (
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
                    existingBus?.attachments
                      ?.map((a) => a.fileName)
                      .join(",") ?? "new"
                  }
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingBus?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingBus?.notes)) && (
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
        {!busId ? "Add Bus" : "Update Bus"}
      </Button>
    </FormContainer>
  );
};

export default BusForm;
