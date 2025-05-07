import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { drivingRouteSchema } from "../schema/drivingRouteSchema";
import { z } from "zod";
import {
  AddDetailsButtonContainer,
  AddMoreGraphicsLine,
  AddMoreSectionContents,
  ContentTitle,
  ContentTitleContainer,
  DistinationDateContainer,
  DestinationDateCheckbox,
  DestinationDateText,
  FormContainer,
  FormSections,
  InputDatesRow,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./DrivingRouteForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import CheckboxSelected from "@assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "@assets/Checkbox_Unselected.svg?react";
import Button from "@components/Button/Button";
import DrivingIcon from "@assets/Driving.svg?react";
import DurationIcon from "@assets/Duration.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import { useNavigate } from "react-router-dom";
import { selectDrivingRouteById } from "@/store/selectors/selectors";
import {
  addDrivingTable,
  fetchDrivingRouteTable,
  updateDrivingTable,
} from "../thunk/drivingThunk";

// NOTE: ALL WALKING DATA (see DrivingRouteSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type DrivingRouteFormData = z.infer<typeof drivingRouteSchema>;

interface DrivingRouteFormProps {
  drivingId?: string;
}

const DrivingRouteForm: React.FC<DrivingRouteFormProps> = ({ drivingId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING DRIVING ROUTE DATA FROM STATE IF ID PASSED
  const existingDrivingRoute = useSelector((state: RootState) =>
    selectDrivingRouteById(state, drivingId)
  );

  const [showArrivalDate, setShowArrivalDate] = useState(
    !!existingDrivingRoute?.arrivalDate
  );
  const [showAddNotes, setShowAddNotes] = useState(
    !!existingDrivingRoute?.notes
  );
  const [isLoading, setIsLoading] = useState(false);

  // REACT-HOOK-FORM FUNCTIONS
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DrivingRouteFormData>({
    resolver: zodResolver(drivingRouteSchema),
  });

  // WATCH DEPARTURE DATE FOR ARRIVAL MIN DATE
  const departureDate = watch("departureDate");

  // FETCH DRIVING DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (drivingId) {
      dispatch(fetchDrivingRouteTable(drivingId));
    }
  }, [dispatch, drivingId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingDrivingRoute) {
      // Reset to todays date/time if remaining train date/time is not present
      const convertedTrain = {
        ...existingDrivingRoute,
        departureDate: existingDrivingRoute.departureDate
          ? new Date(existingDrivingRoute.departureDate)
          : new Date(),
        arrivalDate: existingDrivingRoute.arrivalDate
          ? new Date(existingDrivingRoute.arrivalDate)
          : new Date(),
        departureTime: existingDrivingRoute.departureTime
          ? new Date(existingDrivingRoute.departureTime)
          : new Date(),
      };
      reset(convertedTrain);

      if (existingDrivingRoute.notes) {
        setShowAddNotes(true);
      }

      if (existingDrivingRoute.arrivalDate) {
        setShowArrivalDate(true);
      }
    } else {
      reset();
    }
  }, [existingDrivingRoute, reset]);

  // HELPER FUNCTION
  const handleDropoffCheckbox = () => {
    if (showArrivalDate) {
      setValue("arrivalDate", undefined);
    }
    setShowArrivalDate((prev) => !prev);
  };

  // SUBMIT DRIVING FORM DATA
  const onSubmit = async (data: DrivingRouteFormData) => {
    const { ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE DRIVING
      if (drivingId) {
        const updatedDrivingRoute = {
          ...existingDrivingRoute,
          ...rest,
          id: Number(existingDrivingRoute?.id),
        };

        await dispatch(
          updateDrivingTable({ driving: updatedDrivingRoute })
        ).unwrap();
      } else {
        // ADD DRIVING
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(addDrivingTable({ driving: newData })).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save driving route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (drivingId && !existingDrivingRoute) return <div>Loading...</div>;

  return (
    <FormContainer
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <FormSections>
        <Section>
          <SectionGraphics>
            <DrivingIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Departure</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.departureLocation}
                register={register}
                label={"Departure Location"}
                name={"departureLocation"}
                placeholder="Enter the departure address"
              />
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.departureDate}
                  label={"Departure Date"}
                  name={"departureDate"}
                />
                <InputTime
                  control={control}
                  error={errors.departureTime}
                  label={"Departure Time"}
                  name={"departureTime"}
                />
              </InputDatesRow>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <DurationIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Duration</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.driveDuration}
                register={register}
                label={"Drive Duration"}
                name={"driveDuration"}
                placeholder="e.g. 15 min"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <DrivingIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Arrival</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.arrivalLocation}
                register={register}
                label={"Arrival Location"}
                name={"arrivalLocation"}
                placeholder="Enter the destination address"
              />
              <DistinationDateContainer>
                <DestinationDateCheckbox onClick={handleDropoffCheckbox}>
                  {showArrivalDate ? (
                    <CheckboxSelected />
                  ) : (
                    <CheckboxUnselected />
                  )}
                  <DestinationDateText>
                    Different Arrival Date?
                  </DestinationDateText>
                </DestinationDateCheckbox>
                {showArrivalDate && (
                  <InputDate
                    control={control}
                    error={errors.arrivalDate}
                    label={"Arrival Date"}
                    minDate={departureDate ?? undefined}
                    name={"arrivalDate"}
                  />
                )}
              </DistinationDateContainer>
            </SectionInputs>
          </SectionContents>
        </Section>
        {(!!showAddNotes ||
          (!!showAddNotes && !!existingDrivingRoute?.notes)) && (
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
          {!showAddNotes && (
            <AddMoreSectionContents>
              <ContentTitleContainer>
                <ContentTitle>Add More Details</ContentTitle>
              </ContentTitleContainer>
              <AddDetailsButtonContainer>
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
        {!drivingId ? "Add Driving Route" : "Update Driving Route"}
      </Button>
    </FormContainer>
  );
};

export default DrivingRouteForm;
