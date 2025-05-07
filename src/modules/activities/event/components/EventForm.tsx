import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { eventSchema } from "../schema/eventSchema";
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
} from "./EventForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import EventIcon from "@assets/Event.svg?react";
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
import { addEventTable, fetchEventTable, updateEventTable } from "../thunk/eventThunk";

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  eventId?: string;
}

const EventForm: React.FC<EventFormProps> = ({ eventId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING EVENT DATA FROM STATE IF ID PASSED
  const existingEvent = useSelector((state: RootState) =>
    state.event.events.find((event) => event.id === eventId)
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingEvent?.attachments && existingEvent.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingEvent?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingEvent?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingEvent?.cost;
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
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

    // WATCH START DATE FOR END MIN DATE
    const startDate = watch("startDate");

  // FETCH EVENT DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (eventId) {
      dispatch(fetchEventTable(eventId));
    }
  }, [dispatch, eventId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingEvent) {
      // Reset to todays date/time if remaining event date/time is not present
      const convertedEvent = {
        ...existingEvent,
        startDate: existingEvent.startDate
          ? new Date(existingEvent.startDate)
          : new Date(),
        endDate: existingEvent.endDate
          ? new Date(existingEvent.endDate)
          : new Date(),
        startTime: existingEvent.startTime
          ? new Date(existingEvent.startTime)
          : new Date(),
        endTime: existingEvent.endTime
          ? new Date(existingEvent.endTime)
          : new Date(),
      };

      reset(convertedEvent);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingEvent.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingEvent, existingAttachments, reset]);

  // SUBMIT EVENT FORM DATA
  const onSubmit = async (data: EventFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE EVENT
      if (eventId) {
        const updatedEvent = {
          ...existingEvent,
          ...rest,
          id: Number(existingEvent?.id),
        };

        await dispatch(
          updateEventTable({
            event: updatedEvent,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD EVENT
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addEventTable({ event: newData, files: attachments, travelers })
        ).unwrap();
      }

      navigate("/");
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (eventId && !existingEvent) return <div>Loading...</div>;

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
                error={errors.eventName}
                register={register}
                label={"Name of Event"}
                name={"eventName"}
                placeholder="Enter name of the event"
              />
              <InputText
                error={errors.eventLocation}
                register={register}
                label={"Location"}
                name={"eventLocation"}
                placeholder="Enter address for the event"
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
                  minDate={startDate ?? undefined}
                  name={"endDate"}
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
            <EventIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Event</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.eventOrganizer}
                register={register}
                label={"Name of Organizer"}
                name={"eventOrganizer"}
                placeholder="Enter name of the organizer"
              />
              <InputText
                error={errors.ticketType}
                register={register}
                label={"Ticket Type"}
                name={"ticketType"}
                placeholder="Enter type of ticket / seat you have"
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
        {(!!showCost || (!!showCost && !!existingEvent?.cost)) && (
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
                  key={existingEvent?.attachments?.map((a) => a.fileName).join(",") ?? "new"}
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingEvent?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingEvent?.notes)) && (
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
        {!eventId ? "Add Event" : "Update Event"}
      </Button>
    </FormContainer>
  );
};

export default EventForm;
