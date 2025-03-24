import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../../store";
import { addTrain, updateTrain } from "../slice/trainSlice";
import { trainSchema } from "../schema/trainSchema";
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
} from "./TrainForm.styles";
import { theme } from "../../../../styles/theme";
import InputText from "../../../../components/Inputs/InputText/InputText";
import InputDate from "../../../../components/Inputs/InputDate/InputDate";
import InputTime from "../../../../components/Inputs/InputTime/InputTime";
import InputSelect from "../../../../components/Inputs/InputSelect/InputSelect";
import Button from "../../../../components/Button/Button";
import StartIcon from "../../../../assets/Start.svg?react";
import EndIcon from "../../../../assets/End.svg?react";
import RailwayIcon from "../../../../assets/Train.svg?react";
import UsersIcon from "../../../../assets/Users.svg?react";
import CostIcon from "../../../../assets/Cost.svg?react";
import AddNotesIcon from "../../../../assets/AdditionalNotes.svg?react";
import AttachmentsIcon from "../../../../assets/Attachments.svg?react";
import ChevRight from "../../../../assets/Chevron_Right.svg?react"

// NOTE: ALL TRAIN DATA (see trainSchema) MUST BE PRESENT FOR SUBMIT TO WORK

type TrainFormData = z.infer<typeof trainSchema>;

interface TrainFormProps {
	trainId?: string;
}

const TrainForm: React.FC<TrainFormProps> = ({ trainId }) => {
	const dispatch = useDispatch();
	const existingTrain = useSelector((state: RootState) =>
		state.train.trains.find((train) => train.id === trainId)
	);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<TrainFormData>({
		resolver: zodResolver(trainSchema),
	});

	useEffect(() => {
		if (existingTrain) {
			reset(existingTrain);
		} else {
			reset();
		}
	}, [existingTrain, reset]);

	const onSubmit = (data: TrainFormData) => {
		if (trainId) {
			const updatedTrain = { ...existingTrain, ...data, id: trainId };
			dispatch(updateTrain(updatedTrain));
		} else {
			console.log("data", data)
			const newTrain = { id: uuidv4(), ...data };
			console.log(newTrain);

			dispatch(addTrain(newTrain));
		}
	};

	//TODO: grab friends from database for this groupcation
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
		<FormContainer onSubmit={handleSubmit((data) => {
      onSubmit(data);
    })}>
      <FormSections
		>
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
							error={errors.departureStation}
							register={register}
							label={"Station"}
							name={"departureStation"}
							placeholder="Enter name of train station"
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
							error={errors.arrivalStation}
							register={register}
							label={"Station"}
							name={"arrivalStation"}
							placeholder="Enter name of train station"
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
					<RailwayIcon color={theme.iconText} />
					<SectionGraphicsLine />
				</SectionGraphics>
				<SectionContents>
					<ContentTitleContainer>
						<ContentTitle>Railway</ContentTitle>
					</ContentTitleContainer>
					<SectionInputs>
						<InputText
							error={errors.railwayLine}
							register={register}
							label={"Train Line"}
							name={"railwayLine"}
							placeholder="Enter name of the train line"
						/>
						<InputText
							error={errors.class}
							register={register}
							label={"Class"}
							name={"class"}
							placeholder="Enter a class name for this journey"
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
			<Section>
				<SectionGraphics>
					<AddMoreGraphicsLine />
				</SectionGraphics>
				<AddMoreSectionContents>
					<ContentTitleContainer>
						<ContentTitle>Add More Details</ContentTitle>
					</ContentTitleContainer>
          <AddDetailsButtonContainer>
            <Button
              color="tertiary"
              ariaLabel="add cost"
              onClick={() => console.log("add cost")}
              leftIcon={<CostIcon color={theme.iconText}/>}
            >
              Cost
            </Button>
            <Button
              color="tertiary"
              ariaLabel="add notes"
              onClick={() => console.log("add notes")}
              leftIcon={<AddNotesIcon color={theme.iconText}/>}
            >
              Additional Notes
            </Button>
            <Button
              color="tertiary"
              ariaLabel="add attachments"
              onClick={() => console.log("add attachments")}
              leftIcon={<AttachmentsIcon color={theme.iconText}/>}
            >
              Attachments
            </Button>
          </AddDetailsButtonContainer>
				</AddMoreSectionContents>
			</Section>
		</FormSections>
      <Button 
        rightIcon={<ChevRight color={theme.base} />}
        onClick={() => console.log("reset form or close to homepage")}
        color="primary"
        ariaLabel="submit"
        type="submit"
      >
          Add Train
      </Button>
    </FormContainer>
	);
};

export default TrainForm;
