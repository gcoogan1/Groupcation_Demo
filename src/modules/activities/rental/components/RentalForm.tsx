import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
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
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import EndIcon from "@assets/End.svg?react";
import RailwayIcon from "@assets/Rental.svg?react";
import UsersIcon from "@assets/Users.svg?react";
import CostIcon from "@assets/Cost.svg?react";
import AddNotesIcon from "@assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "@assets/Attachments.svg?react";
import ChevRight from "@assets/Chevron_Right.svg?react";
import InputNumber from "@components/Inputs/InputNumber/InputNumber";
import CheckboxSelected from "@assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "@assets/Checkbox_Unselected.svg?react";
import RemoveButton from "@components/RemoveButton/RemoveButton";
import InputAttachment from "@components/Inputs/InputAttachment/InputAttachment";
import InputTextArea from "@components/Inputs/InputTextArea/InputTextArea";
import { useNavigate } from "react-router-dom";
import { selectConvertedUsers } from "@store/selectors/selectors";
import {
  addRentalTable,
  fetchRentalTable,
  updateRentalTable,
} from "../thunk/rentalThunk";

// NOTE: ALL TRAIN DATA (see rentalSchema) MUST BE PRESENT FOR SUBMIT TO WORK
//TODO: grab friends from database for this groupcation (options)
//TODO: get URL from attachments upload to store as string[] in state slice instead of File[]

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  rentalId?: string;
}

const RentalForm: React.FC<RentalFormProps> = ({ rentalId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING RENTAL DATA FROM STATE IF ID PASSED
  const existingRental = useSelector((state: RootState) =>
    state.rental.rentals.find((rental) => rental.id === rentalId)
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingRental?.attachments && existingRental.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingRental?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingRental?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingRental?.cost; // something like "123.45"
    if (costString) {
      const num = Math.round(parseFloat(costString) * 100); // convert to cents
      return isNaN(num) ? 0 : num;
    }
    return 0;
  });
  const [showDropOffLocal, setShowDropOffLocal] = useState(
    !!existingRental?.dropOffLocation
  );
  const [travelers, setTravelers] = useState(users);
  const [isLoading, setIsLoading] = useState(false);

  // IF ALL DETAILS SHOWN, HIDE "ADD MORE DETAILS"
  const allDetailsShown = showCost && showAddNotes && showAttachments;

  // HELPER FUNCTION
  const handleDropoffCheckbox = () => {
    if (showDropOffLocal) {
      setValue("dropOffLocation", undefined);
    }
    setShowDropOffLocal((prev) => !prev);
  };

  // REACT-HOOK-FORM FUNCTIONS
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

  // FETCH RENTAL DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (rentalId) {
      dispatch(fetchRentalTable(rentalId));
    }
  }, [dispatch, rentalId]);

  // SET/CONVERT FORM IF EXISTING DATA
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

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingRental.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingRental, existingAttachments, reset]);

  // SUBMIT RENTAL FORM DATA
  const onSubmit = async (data: RentalFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE RENTAL
      if (rentalId) {
        const updatedRental = {
          ...existingRental,
          ...rest,
          id: Number(existingRental?.id),
        };

        await dispatch(
          updateRentalTable({
            rental: updatedRental,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {

        // ADD RENTAL
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addRentalTable({ rental: newData, files: attachments, travelers })
        ).unwrap();
      }

      navigate("/");
    } catch (error) {
      console.error("Failed to save rental:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (rentalId && !existingRental) return <div>Loading...</div>;

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
                options={travelers}
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
                  key={existingRental?.attachments?.map((a) => a.fileName).join(",") ?? "new"}
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
        {!rentalId ? "Add Rental" : "Update Rental"}
      </Button>
    </FormContainer>
  );
};

export default RentalForm;
