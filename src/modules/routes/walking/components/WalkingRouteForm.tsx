import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { walkingRouteSchema } from "../schema/walkingRouteSchema";
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
} from "./WalkingRouteForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import Button from "@components/Button/Button";
import DurationIcon from "@assets/Duration.svg?react";
import WalkingIcon from "@assets/Walking.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import { useNavigate } from "react-router-dom";
import {
  addWalkingTable,
  deleteWalkingTable,
  fetchWalkingRouteTable,
  updateWalkingTable,
} from "../thunk/walkingThunk";

// NOTE: ALL WALKING DATA (see WalkingRouteSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type WalkingRouteFormData = z.infer<typeof walkingRouteSchema>;

interface WalkingRouteFormProps {
  walkingId?: string;
}

const WalkingRouteForm: React.FC<WalkingRouteFormProps> = ({ walkingId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING WALKING ROUTE DATA FROM STATE IF ID PASSED
  const existingWalkingRoute = useSelector((state: RootState) =>
    state.walkingRoute.walkingRoutes.find(
      (walkingRoute) => walkingRoute.id === walkingId
    )
  );

  const [showAddNotes, setShowAddNotes] = useState(
    !!existingWalkingRoute?.notes
  );
  const [isLoading, setIsLoading] = useState(false);

  // REACT-HOOK-FORM FUNCTIONS
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WalkingRouteFormData>({
    resolver: zodResolver(walkingRouteSchema),
  });

  // FETCH DRIVING DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (walkingId) {
      dispatch(fetchWalkingRouteTable(walkingId));
    }
  }, [dispatch, walkingId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingWalkingRoute) {
      // Reset to todays date/time if remaining train date/time is not present
      const convertedTrain = {
        ...existingWalkingRoute,
        departureDate: existingWalkingRoute.departureDate
          ? new Date(existingWalkingRoute.departureDate)
          : new Date(),
        departureTime: existingWalkingRoute.departureTime
          ? new Date(existingWalkingRoute.departureTime)
          : new Date(),
      };
      reset(convertedTrain);

      if (existingWalkingRoute.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingWalkingRoute, reset]);

  // SUBMIT WALKING FORM DATA
  const onSubmit = async (data: WalkingRouteFormData) => {
    const { ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE WALKING
      if (walkingId) {
        const updatedWalkingRoute = {
          ...existingWalkingRoute,
          ...rest,
          id: Number(existingWalkingRoute?.id),
        };

        await dispatch(
          updateWalkingTable({ walking: updatedWalkingRoute })
        ).unwrap();
      } else {
        // ADD WALKING
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(addWalkingTable({ walking: newData })).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save walking route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
    try {
      if (walkingId) await dispatch(deleteWalkingTable(walkingId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete walking route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (walkingId && !existingWalkingRoute) return <div>Loading...</div>;

  return (
    <FormContainer
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <FormSections>
        <Section>
          <SectionGraphics>
            <WalkingIcon color={theme.iconText} />
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
                placeholder="Enter the departure location of the walk"
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
                error={errors.walkDuration}
                register={register}
                label={"Walking Duration"}
                name={"walkDuration"}
                placeholder="e.g. 5 min"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <WalkingIcon color={theme.iconText} />
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
                placeholder="Enter the arrival location of the walk"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        {(!!showAddNotes ||
          (!!showAddNotes && !!existingWalkingRoute?.notes)) && (
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
        {!walkingId ? "Add Walking Route" : "Update Walking Route"}
      </Button>
      {walkingId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default WalkingRouteForm;
