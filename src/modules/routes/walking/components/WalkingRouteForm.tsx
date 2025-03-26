import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addWalking, updateWalking } from "../slice/walkingRouteSlice";
import { WalkingRouteSchema } from "../schema/walkingRouteSchema";
import { z } from "zod";
import {
  AddDetailsButtonContainer,
  AddMoreGraphicsLine,
  AddMoreSectionContents,
  ContentTitle,
  ContentTitleContainer,
  FormContainer,
  FormSections,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./WalkingRouteForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import Button from "../../../../components/Button/Button";
import WalkingIcon from "../../../../assets/Walking.svg?react";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import RemoveButton from "../../../../components/RemoveButton/RemoveButton";
import InputTextArea from "../../../../components/Inputs/InputTextArea/InputTextArea";

// NOTE: ALL WALKING DATA (see WalkingRouteSchema) MUST BE PRESENT FOR SUBMIT TO WORK


type WalkingRouteFormData = z.infer<typeof WalkingRouteSchema>;

interface WalkingRouteFormProps {
  walkingId?: string;
}

const WalkingRouteForm: React.FC<WalkingRouteFormProps> = ({ walkingId }) => {
  const dispatch = useDispatch();
  const existingWalkingRoute = useSelector((state: RootState) =>
    state.walkingRoute.walkingRoutes.find((walkingRoute) => walkingRoute.id === walkingId)
  );
  const [showAddNotes, setShowAddNotes] = useState(!!existingWalkingRoute?.notes);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WalkingRouteFormData>({
    resolver: zodResolver(WalkingRouteSchema),
  });

  useEffect(() => {
    if (existingWalkingRoute) {
      reset(existingWalkingRoute);
    } else {
      reset();
    }
  }, [existingWalkingRoute, reset]);

  const onSubmit = (data: WalkingRouteFormData) => {
    if (walkingId) {
      const updatedWalkingRoute = { ...existingWalkingRoute, ...data, id: walkingId };
      console.log("Updated WalkingRoute:", updatedWalkingRoute);
      dispatch(updateWalking(updatedWalkingRoute));
    } else {
      const newWalkingRoute = { id: uuidv4(), ...data };
      console.log("New WalkingRoute:", newWalkingRoute);
      dispatch(addWalking(newWalkingRoute));
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
            <WalkingIcon color={theme.iconText} />
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
                placeholder="e.g. 5 min to train station"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        {(!!showAddNotes || (!!showAddNotes && !!existingWalkingRoute?.notes)) && (
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
        {!walkingId ? "Add Walking Route" : "Update Walking Route"}
      </Button>
    </FormContainer>
  );
};

export default WalkingRouteForm;
