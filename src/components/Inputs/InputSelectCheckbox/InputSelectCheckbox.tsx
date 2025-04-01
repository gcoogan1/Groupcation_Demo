import { Controller } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { theme } from "../../../styles/theme";
import { InputContainer, StyledLabel } from "./InputSelectCheckbox.styles";
import CheckboxSelected from "../../../assets/Checkbox_Selected.svg?react";
import CheckboxUnselected from "../../../assets/Checkbox_Unselected.svg?react";

interface Option {
	value: string | number;
	label: string;
}

interface InputSelectProps {
	label: string;
	name: string;
	options: Option[];
	placeholder?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: any;
}

const InputSelect: React.FC<InputSelectProps> = ({
	label,
	name,
	options,
	placeholder,
	control,
}) => {
	return (
		<InputContainer>
			<StyledLabel>{label}</StyledLabel>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Autocomplete
						multiple
						options={options}
						getOptionLabel={(option) => option.label}
						value={field.value || []}
						onChange={(_, value) => {
							const uniqueValues = Array.from(
								new Set(value.map((v) => v.value))
							).map((val) => value.find((item) => item.value === val));
							field.onChange(uniqueValues);
						}}
						disableCloseOnSelect
						renderOption={(props, option) => {
							const isSelected = field.value?.some(
								(item: Option) => item.value === option.value
							);
							return (
								<li {...props} key={option.label}>
									<Checkbox
										icon={<CheckboxUnselected />}
										checkedIcon={<CheckboxSelected />}
										style={{ marginRight: 8 }}
										checked={Boolean(isSelected)}
									/>
									{option.label}
								</li>
							);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder={placeholder || "Select travelers..."}
								variant="outlined"
								sx={{
									"& .MuiInputBase-root": {
										fontFamily: "Rubik",
										fontSize: "14px",
										padding: "8px 12px",
										color: `${theme.iconText}`,
									},
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: `${theme.secondary}`,
										borderWidth: "2px",
										borderStyle: "solid",
									},
									"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
										{
											borderColor: `${theme.secondary}`,
										},
									"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
										{
											borderColor: `${theme.secondary}`,
										},
									"& .MuiAutocomplete-tag": {
										fontFamily: "Rubik",
										backgroundColor: `${theme.iconText}`,
										color: `${theme.base}`,
										borderRadius: "4px",
										margin: "2px",
										padding: "4px 8px",
									},
									"& .MuiInputLabel-root": {
										fontFamily: "Rubik",
										fontSize: "12px",
										fontWeight: "600",
									},
									"& .MuiInputLabel-root.Mui-focused": {
										color: `${theme.secondary}`,
									},
									"& .MuiAutocomplete-popupIndicator": {
										color: `${theme.iconText}`,
									},
									"& .MuiInputBase-input::placeholder": {
										color: `${theme.secondary}`,
										opacity: 0.7,
									},
								}}
							/>
						)}
					/>
				)}
			/>
		</InputContainer>
	);
};

export default InputSelect;
