import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addRental, updateRental } from "../slice/rentalSlice";
import { rentalSchema } from "../schema/rentalSchema";
import { z } from "zod";
import {
  AddDetailsButtonContainer,
  AddMoreGraphicsLine,
  AddMoreSectionContents,
  ContentTitle,
  ContentTitleContainer,
  DropoffCheckbox,
  DropoffContainer,
  DropoffText,
  FormContainer,
  FormSections,
  InputDatesRow,
  Section,
  SectionContents,
  SectionGraphics,
  SectionGraphicsLine,
  SectionInputs,
} from "./RentalForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import RailwayIcon from "../../../../assets/Rental.svg?react";
import UsersIcon from "../../../../assets/Users.svg?react";
import CostIcon from "../../../../assets/Cost.svg?react";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "../../../../assets/Attachments.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react";
import InputNumber from "../../../../components/Inputs/InputNumber/InputNumber";
import CheckboxSelected from "../../../../assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "../../../../assets/Checkbox_Unselected.svg?react";
import RemoveButton from "../../../../components/RemoveButton/RemoveButton";
import InputAttachment from "../../../../components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "../../../../components/Inputs/InputTextArea/InputTextArea";
import { convertFormDatesToString } from "../../../../utils/dateFunctions/dateFunctions";

// NOTE: ALL TRAIN DATA (see rentalSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)
//TODO: get URL from attachments upload to store as string[] in state slice instead of File[]

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  rentalId?: string;
}

const RentalForm: React.FC<RentalFormProps> = ({ rentalId }) => {
  const dispatch = useDispatch();
  const existingRental = useSelector((state: RootState) =>
    state.rental.rentals.find((rental) => rental.id === rentalId)
  );
  const [showCost, setShowCost] = useState(!!existingRental?.cost);
  const [showAttachments, setShowAttachments] = useState(
    !!existingRental?.attachments
  );
  const [showAddNotes, setShowAddNotes] = useState(!!existingRental?.notes);
  const [amount, setAmount] = useState(0);
  const [showDropOffLocal, setShowDropOffLocal] = useState(!!existingRental?.dropOffLocation);

  const allDetailsShown = showCost && showAddNotes && showAttachments;

  const handleDropoffCheckbox = () => {
    if(showDropOffLocal) {
      setValue("dropOffLocation", undefined);
    }
    setShowDropOffLocal((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
  });

  useEffect(() => {
    if (existingRental) {
      // Reset to todays date/time if remaining rental date/time is not present
      const convertedRental = {
        ...existingRental,
        pickUpDate: existingRental.pickUpDate
          ? new Date(existingRental.pickUpDate)
          : new Date(),
        dropOffDate: existingRental.dropOffDate
          ? new Date(existingRental.dropOffDate)
          : new Date(),
        pickUpTime: existingRental.pickUpTime
          ? new Date(existingRental.pickUpTime)
          : new Date(),
        dropOffTime: existingRental.dropOffTime
          ? new Date(existingRental.dropOffTime)
          : new Date(),
      };

      reset(convertedRental);
    } else {
      reset();
    }
  }, [existingRental, reset]);

  const onSubmit = (data: RentalFormData) => {
    // Convert the dates in the form data to ISO strings
    const convertedData = convertFormDatesToString(data);

    if (rentalId) {
      const updatedRental = {
        ...existingRental,
        ...convertedData,
        id: rentalId,
      };
      console.log("Updated rental:", updatedRental);
      dispatch(updateRental(updatedRental));
    } else {
      const newRental = { id: uuidv4(), ...convertedData };
      console.log("New rental:", newRental);
      dispatch(addRental(newRental));
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
              <ContentTitle>Pick-up</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.pickUpDate}
                  label={"Pick-up Date"}
                  name={"pickUpDate"}
                />
                <InputTime
                  control={control}
                  error={errors.pickUpTime}
                  label={"Pick-up Time"}
                  name={"pickUpTime"}
                />
              </InputDatesRow>
              <InputText
                error={errors.pickUpLocation}
                register={register}
                label={"Pick-up Location"}
                name={"pickUpLocation"}
                placeholder="Enter pick-up address"
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
              <ContentTitle>Drop-off</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.dropOffDate}
                  label={"Drop-off Date"}
                  name={"dropOffDate"}
                />
                <InputTime
                  control={control}
                  error={errors.dropOffTime}
                  label={"Drop-off Time"}
                  name={"dropOffTime"}
                />
              </InputDatesRow>
              <DropoffContainer>
                <DropoffCheckbox onClick={handleDropoffCheckbox}>
                  {showDropOffLocal ? (
                    <CheckboxSelected />
                  ) : (
                    <CheckboxUnselected />
                  )}
                  <DropoffText>Different Drop-off Location</DropoffText>
                </DropoffCheckbox>
                {showDropOffLocal && (
                  <InputText
                    error={errors.dropOffLocation}
                    register={register}
                    label={"Drop-off Location"}
                    name={"dropOffLocation"}
                    placeholder="Enter drop-off address"
                  />
                )}
              </DropoffContainer>
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <RailwayIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Vehicle</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.rentalAgency}
                register={register}
                label={"Rental Agency"}
                name={"rentalAgency"}
                placeholder="Enter name of the rental agency"
              />
              <InputText
                error={errors.carType}
                register={register}
                label={"Car Type"}
                name={"carType"}
                placeholder="Enter the type of vehicle"
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
        {(!!showCost || (!!showCost && !!existingRental?.cost)) && (
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
          (!!showAttachments && !!existingRental?.attachments)) && (
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
                  defaultFiles={existingRental?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes || (!!showAddNotes && !!existingRental?.notes)) && (
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
        {!rentalId ? "Add Rental" : "Update Rental"}
      </Button>
    </FormContainer>
  );
};

export default RentalForm;
