import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/store";
import { addDriving, updateDriving } from "../slice/drivingRouteSlice";
import { DrivingRouteSchema } from "../schema/drivingRouteSchema";
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

// NOTE: ALL WALKING DATA (see DrivingRouteSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type DrivingRouteFormData = z.infer<typeof DrivingRouteSchema>;

interface DrivingRouteFormProps {
  drivingId?: string;
}

const DrivingRouteForm: React.FC<DrivingRouteFormProps> = ({ drivingId }) => {
  const dispatch = useDispatch();
  const existingDrivingRoute = useSelector((state: RootState) =>
    state.drivingRoute.drivingRoutes.find(
      (drivingRoute) => drivingRoute.id === drivingId
    )
  );
  const [showArrivalDate, setShowArrivalDate] = useState(
    !!existingDrivingRoute?.arrivalDate
  );
  const [showAddNotes, setShowAddNotes] = useState(
    !!existingDrivingRoute?.notes
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DrivingRouteFormData>({
    resolver: zodResolver(DrivingRouteSchema),
  });

  useEffect(() => {
    if (existingDrivingRoute) {
      reset(existingDrivingRoute);
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

  const onSubmit = (data: DrivingRouteFormData) => {
    if (drivingId) {
      const updatedDrivingRoute = {
        ...existingDrivingRoute,
        ...data,
        id: drivingId,
      };
      dispatch(updateDriving(updatedDrivingRoute));
    } else {
      const newDrivingRoute = { id: uuidv4(), ...data };
      dispatch(addDriving(newDrivingRoute));
    }
  };

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
                placeholder="e.g. 15 min drive to train station"
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
      >
        {!drivingId ? "Add Driving Route" : "Update Driving Route"}
      </Button>
    </FormContainer>
  );
};

export default DrivingRouteForm;