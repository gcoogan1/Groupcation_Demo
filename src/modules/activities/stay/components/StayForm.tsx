import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { staySchema } from "../schema/staySchema";
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
} from "./StayForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import PlaceIcon from "../../../../assets/Stay.svg?react";
import UsersIcon from "../../../../assets/Users.svg?react";
import CostIcon from "../../../../assets/Cost.svg?react";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "../../../../assets/Attachments.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import InputNumber from "../../../../components/Inputs/InputNumber/InputNumber";
import RemoveButton from "../../../../components/RemoveButton/RemoveButton";
import InputAttachment from "../../../../components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "../../../../components/Inputs/InputTextArea/InputTextArea";
import {
  selectConvertedUsers,
  selectStayById,
} from "../../../../store/selectors/selectors";
import {
  addStayTable,
  fetchStayTable,
  updateStayTable,
} from "../thunk/stayThunk";

// NOTE: ALL STAY DATA (see staySchema) MUST BE PRESENT FOR SUBMIT TO WORK

type StayFormData = z.infer<typeof staySchema>;

interface StayFormProps {
  stayId?: string;
}

const StayForm: React.FC<StayFormProps> = ({ stayId }) => {
  const dispatch = useDispatch<AppDispatch>();

  // FETCH EXISTING STAY DATA FROM STATE IF ID PASSED
  const existingStay = useSelector((state: RootState) =>
    selectStayById(state, stayId)
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);

  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingStay?.attachments && existingStay.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingStay?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [amount, setAmount] = useState(0);
  const [travelers, setTravelers] = useState(users);


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
  } = useForm<StayFormData>({
    resolver: zodResolver(staySchema),
  });

  // FETCH STAY DATA FROM API
  useEffect(() => {
    if (stayId) {
      dispatch(fetchStayTable(stayId));
    }
  }, [dispatch, stayId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingStay) {
      const convertedStay = {
        ...existingStay,
        checkInDate: existingStay.checkInDate
          ? new Date(existingStay.checkInDate)
          : new Date(),
        checkInTime: existingStay.checkInTime
          ? new Date(existingStay.checkInTime)
          : new Date(),
        checkOutDate: existingStay.checkOutDate
          ? new Date(existingStay.checkOutDate)
          : new Date(),
        checkOutTime: existingStay.checkOutTime
          ? new Date(existingStay.checkOutTime)
          : new Date(),
      };

      reset(convertedStay);
      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingStay.notes) {
        setShowAddNotes(true)
      }
    } else {
      reset();
    }
  }, [existingStay, existingAttachments, reset]);

  // SUBMIT STAY FORM DATA
  const onSubmit = (data: StayFormData) => {
    const { attachments, travelers, ...rest } = data;

    if (stayId) {
      const updatedStay = {
        ...existingStay,
        ...rest,
        id: Number(existingStay?.id),
      };

      dispatch(
        updateStayTable({
          stay: updatedStay,
          files: attachments,
          selectedTravelers: travelers,
        })
      );
    } else {
      // ADD STAY
      const newData = {
        groupcationId: 333,
        createdBy: 3,
        ...rest,
      };
      dispatch(addStayTable({ stay: newData, files: attachments, travelers }));
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
            <StartIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Check-in</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.checkInDate}
                  label={"Check-in Date"}
                  name={"checkInDate"}
                />
                <InputTime
                  control={control}
                  error={errors.checkInTime}
                  label={"Check-in Time"}
                  name={"checkInTime"}
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
              <ContentTitle>Check-out</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.checkOutDate}
                  label={"Check-out Date"}
                  name={"checkOutDate"}
                />
                <InputTime
                  control={control}
                  error={errors.checkOutTime}
                  label={"Check-out Time"}
                  name={"checkOutTime"}
                />
              </InputDatesRow>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <PlaceIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Place</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.placeName}
                register={register}
                label={"Name of Place"}
                name={"placeName"}
                placeholder="Enter name of the hotel / homestay"
              />
              <InputText
                error={errors.placeAddress}
                register={register}
                label={"Address if Place"}
                name={"placeAddress"}
                placeholder="Enter address of the hotel / homestay"
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
        {(!!showCost || (!!showCost && !!existingStay?.cost)) && (
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
          (!!showAttachments && !!existingStay?.attachments)) && (
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
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingStay?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingStay?.notes)) && (
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
      >
        {!stayId ? "Add stay" : "Update stay"}
      </Button>
    </FormContainer>
  );
};

export default StayForm;
