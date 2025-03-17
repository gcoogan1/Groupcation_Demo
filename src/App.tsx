// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react


import FilterItem from "./components/FilterItem/FilterItem";
import Pictogram from "./components/Pictogram/Pictogram";
import Flight from "./assets/Flight.svg?react";
import Note from "./assets/Note.svg?react";
import { theme } from "./styles/theme";
import MenuItem from "./components/MenuItem/MenuItem";
import InputText from "./components/Inputs/InputText/InputText";
import InputDate from "./components/Inputs/InputDate/InputDate";
import InputTime from "./components/Inputs/InputTime/InputTime";
import InputSelect from "./components/Inputs/InputSelect/InputSelect";
import InputNumber from "./components/Inputs/InputNumber/InputNumber";
import { useState } from "react";



const App = () => {
	const [amount, setAmount] = useState(0);
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				flexDirection: "column",
				gap: "6px",
				width: "100%",
			}}
		>
			<h1>Groupcation - To The Alps</h1>

			<div style={{ width: "240px" }}>
				<InputNumber 
					value={amount}
					onChange={(val) => setAmount(val)} label={"Label"} name={"currency"}				 />
			</div>
		</div>
	);
};

export default App;
