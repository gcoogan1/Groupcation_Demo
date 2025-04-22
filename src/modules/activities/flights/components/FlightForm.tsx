import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { flightSchema } from "../schema/flightSchema";
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
  InputTextRows,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./FlightForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelectCheckbox from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import FlightIcon from "@assets/Flight.svg?react";
import UsersIcon from "@assets/Users.svg?react";
import CostIcon from "@assets/Cost.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "@assets/Attachments.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputNumber from "@components/Inputs/InputNumber/InputNumber";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputAttachment from "@components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import InputSelect from "@components/Inputs/InputSelect/InputSelect";
import {
  selectConvertedUsers,
  selectFlightById,
} from "@store/selectors/selectors";
import {
  addFlightTable,
  fetchFlightTable,
  updateFlightTable,
} from "../thunk/flightThunk";
import { useNavigate } from "react-router-dom";

// NOTE: ALL FLIGHT DATA (see flightSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)

type FlightFormData = z.infer<typeof flightSchema>;

interface FlightFormProps {
  flightId?: string;
}

const FlightForm: React.FC<FlightFormProps> = ({ flightId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  // FETCH EXISTING FLIGHT DATA FROM STATE IF ID PASSED
  const existingFlight = useSelector((state: RootState) =>
    selectFlightById(state, flightId)
  );

  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingFlight?.attachments && existingFlight.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingFlight?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingFlight?.notes);
  const [amount, setAmount] = useState(0);
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
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
  });

  // FETCH FLIGHT DATA FROM API
  useEffect(() => {
     // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (flightId) {
      dispatch(fetchFlightTable(flightId));
    }
  }, [dispatch, flightId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingFlight) {
      // Reset to todays date/time if remaining flight date/time is not present
      const convertedFlight = {
        ...existingFlight,
        departureDate: existingFlight.departureDate
          ? new Date(existingFlight.departureDate)
          : new Date(),
        arrivalDate: existingFlight.arrivalDate
          ? new Date(existingFlight.arrivalDate)
          : new Date(),
        departureTime: existingFlight.departureTime
          ? new Date(existingFlight.departureTime)
          : new Date(),
        arrivalTime: existingFlight.arrivalTime
          ? new Date(existingFlight.arrivalTime)
          : new Date(),
      };
      reset(convertedFlight);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingFlight.notes) {
        setShowAddNotes(true)
      }
    } else {
      reset();
    }
  }, [existingFlight, existingAttachments, reset]);

  // SUBMIT FLIGHT FORM DATA
  const onSubmit = async (data: FlightFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true)

    try {
      if (flightId) {
        const updatedFlight = {
          ...existingFlight,
          ...rest,
          id: Number(existingFlight?.id),
        };
  
        await dispatch(
          updateFlightTable({
            flight: updatedFlight,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD FLIGHT
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };
        await dispatch(
          addFlightTable({ flight: newData, files: attachments, travelers })
        ).unwrap();
      }
      navigate("/")
    } catch (error) {
      console.error("Failed to save flight:", error)
    } finally {
      setIsLoading(false)
    }
  };

  if (flightId && !existingFlight) return <div>Loading...</div>

  const classOptions = [
    {
      value: "economy",
      label: "Economy",
    },
    {
      value: "premiumEconomy",
      label: "Premium Economy",
    },
    {
      value: "business",
      label: "Business",
    },
    {
      value: "firstClass",
      label: "First Class",
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
                error={errors.departureAirport}
                register={register}
                label={"Station"}
                name={"departureAirport"}
                placeholder="Enter name of the departure airport"
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
                error={errors.arrivalAirport}
                register={register}
                label={"Station"}
                name={"arrivalAirport"}
                placeholder="Enter name of arrival airport"
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
            <FlightIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Airline</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputTextRows>
                <InputText
                  error={errors.airline}
                  register={register}
                  label={"Airline"}
                  name={"airline"}
                  placeholder="e.g. Swiss Airways"
                />
                <InputText
                  error={errors.flightNumber}
                  register={register}
                  label={"Flight Number"}
                  name={"flightNumber"}
                  placeholder="e.g. SW 123"
                />
              </InputTextRows>
              <InputSelect
                label={"Class"}
                name={"flightClass"}
                options={classOptions}
                register={register}
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
        {(!!showCost || (!!showCost && !!existingFlight?.cost)) && (
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
          (!!showAttachments && !!existingFlight?.attachments)) && (
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
                  key={existingFlight?.attachments?.map((a) => a.fileName).join(",") ?? "new"}
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingFlight?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingFlight?.notes)) && (
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
        {!flightId ? "Add Flight" : "Update Flight"}
      </Button>
    </FormContainer>
  );
};

export default FlightForm;
