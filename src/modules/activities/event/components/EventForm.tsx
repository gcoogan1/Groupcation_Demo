import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addEvent, updateEvent } from "../slice/eventSlice";
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
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import EventIcon from "../../../../assets/Event.svg?react";
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

// NOTE: ALL TRAIN DATA (see eventSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)
//TODO: get URL from attachments upload to store as string[] in state slice instead of File[]

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  eventId?: string;
}

const EventForm: React.FC<EventFormProps> = ({ eventId }) => {
  const dispatch = useDispatch();
  const existingEvent = useSelector((state: RootState) =>
    state.event.events.find((event) => event.id === eventId)
  );
  const [showCost, setShowCost] = useState(!!existingEvent?.cost);
  const [showAttachments, setShowAttachments] = useState(
    !!existingEvent?.attachments
  );
  const [showAddNotes, setShowAddNotes] = useState(!!existingEvent?.notes);
  const [amount, setAmount] = useState(0);

  const allDetailsShown = showCost && showAddNotes && showAttachments;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

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
    } else {
      reset();
    }
  }, [existingEvent, reset]);
  const onSubmit = (data: EventFormData) => {
    // Convert the dates in the form data to ISO strings
    const convertedData = convertFormDatesToString(data);

    if (eventId) {
      const updatedEvent = { ...existingEvent, ...convertedData, id: eventId };
      console.log("Updated event:", updatedEvent);
      dispatch(updateEvent(updatedEvent));
    } else {
      const newEvent = { id: uuidv4(), ...convertedData };
      console.log("New event:", newEvent);
      dispatch(addEvent(newEvent));
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
                options={options}
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
          (!!showAttachments && !!existingEvent?.attachments)) && (
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
        {!eventId ? "Add Event" : "Update Event"}
      </Button>
    </FormContainer>
  );
};

export default EventForm;
