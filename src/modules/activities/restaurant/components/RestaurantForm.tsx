import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { restaurantSchema } from "../schema/restaurantSchema";
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
} from "./RestaurantForm.styles";
import { theme } from "@styles/theme";
import InputText from "@components/Inputs/InputText/InputText";
import InputDate from "@components/Inputs/InputDate/InputDate";
import InputTime from "@components/Inputs/InputTime/InputTime";
import InputSelect from "@components/Inputs/InputSelectCheckbox/InputSelectCheckbox";
import Button from "@components/Button/Button";
import StartIcon from "@assets/Start.svg?react";
import RestaurantIcon from "@assets/Restaurant.svg?react";
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
import {
  addRestaurantTable,
  deleteRestaurantTable,
  fetchRestaurantTable,
  updateRestaurantTable,
} from "../thunk/restaurantThunks";

type RestaurantFormData = z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  restaurantId?: string;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ restaurantId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // FETCH EXISTING RESTAURANT DATA FROM STATE IF ID PASSED
  const existingRestaurant = useSelector((state: RootState) =>
    state.restaurant.restaurants.find(
      (restaurant) => restaurant.id === restaurantId
    )
  );
  // FETCH USERS FROM STATE TO FILL TRAVELERS INPUT
  const users = useSelector(selectConvertedUsers);
  // FETCH ANY EXISTING ATTACHMENTS
  const existingAttachments =
    !!existingRestaurant?.attachments &&
    existingRestaurant.attachments.length > 0;

  // FORM STATE
  const [showCost, setShowCost] = useState(!!existingRestaurant?.cost);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(!!existingRestaurant?.notes);
  const [amount, setAmount] = useState(() => {
    const costString = existingRestaurant?.cost;
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
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  });

  // FETCH TRAIN DATA FROM API
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (restaurantId) {
      dispatch(fetchRestaurantTable(restaurantId));
    }
  }, [dispatch, restaurantId]);

  // SET/CONVERT FORM IF EXISTING DATA
  useEffect(() => {
    if (existingRestaurant) {
      // Reset to todays date/time if remaining restaurant date/time is not present
      const convertedRestaurant = {
        ...existingRestaurant,
        reservationDate: existingRestaurant.reservationDate
          ? new Date(existingRestaurant.reservationDate)
          : new Date(),
        reservationTime: existingRestaurant.reservationTime
          ? new Date(existingRestaurant.reservationTime)
          : new Date(),
      };

      reset(convertedRestaurant);

      if (existingAttachments) {
        setShowAttachments(true);
      }
      if (existingRestaurant.notes) {
        setShowAddNotes(true);
      }
    } else {
      reset();
    }
  }, [existingRestaurant, existingAttachments, reset]);

  // SUBMIT RESTAURANT FORM DATA
  const onSubmit = async (data: RestaurantFormData) => {
    const { attachments, travelers, ...rest } = data;
    setIsLoading(true);

    try {
      // UPDATE RESTAURANT
      if (restaurantId) {
        const updatedRestaurant = {
          ...existingRestaurant,
          ...rest,
          id: Number(existingRestaurant?.id),
        };

        await dispatch(
          updateRestaurantTable({
            restaurant: updatedRestaurant,
            files: attachments,
            selectedTravelers: travelers,
          })
        ).unwrap();
      } else {
        // ADD RESTAURANT
        const newData = {
          groupcationId: 333,
          createdBy: 3,
          ...rest,
        };

        await dispatch(
          addRestaurantTable({
            restaurant: newData,
            files: attachments,
            travelers,
          })
        ).unwrap();
      }

      // Only navigate after the async thunk is fully completed
      navigate("/");
    } catch (error) {
      console.error("Failed to save train:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTable = async () => {
    try {
      if (restaurantId)
        await dispatch(deleteRestaurantTable(restaurantId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (restaurantId && !existingRestaurant) return <div>Loading...</div>;

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
              <ContentTitle>Reservation</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputDatesRow>
                <InputDate
                  control={control}
                  error={errors.reservationDate}
                  label={"Reservation Date"}
                  name={"reservationDate"}
                />
                <InputTime
                  control={control}
                  error={errors.reservationTime}
                  label={"Reservation Time"}
                  name={"reservationTime"}
                />
              </InputDatesRow>
              <InputText
                error={errors.tableType}
                register={register}
                label={"Table Type"}
                name={"tableType"}
                placeholder="e.g. Table for 4"
              />
            </SectionInputs>
          </SectionContents>
        </Section>
        <Section>
          <SectionGraphics>
            <RestaurantIcon color={theme.iconText} />
            <SectionGraphicsLine />
          </SectionGraphics>
          <SectionContents>
            <ContentTitleContainer>
              <ContentTitle>Restaurant</ContentTitle>
            </ContentTitleContainer>
            <SectionInputs>
              <InputText
                error={errors.restaurantName}
                register={register}
                label={"Restaurant Name"}
                name={"restaurantName"}
                placeholder="Enter the name of the restaurant"
              />
              <InputText
                error={errors.restaurantAddress}
                register={register}
                label={"Restaurant Address"}
                name={"restaurantAddress"}
                placeholder="Enter the address of the restaurant"
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
        {(!!showCost || (!!showCost && !!existingRestaurant?.cost)) && (
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
                  key={
                    existingRestaurant?.attachments
                      ?.map((a) => a.fileName)
                      .join(",") ?? "new"
                  }
                  register={register}
                  setValue={setValue}
                  name={"attachments"}
                  defaultFiles={existingRestaurant?.attachments || []}
                />
              </SectionInputs>
            </SectionContents>
          </Section>
        )}
        {(!!showAddNotes ||
          (!!showAddNotes && !!existingRestaurant?.notes)) && (
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
        {!restaurantId ? "Add Restaurant" : "Update Restaurant"}
      </Button>
      {restaurantId && (
        <Button color={"outlined"} ariaLabel={"delete"} onClick={deleteTable}>
          Delete
        </Button>
      )}
    </FormContainer>
  );
};

export default RestaurantForm;
