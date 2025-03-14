// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react


import FilterItem from "./components/FilterItem/FilterItem";
import Pictogram from "./components/Pictogram/Pictogram";
import Flight from "./assets/Flight.svg?react";
import Note from "./assets/Note.svg?react";
import { theme } from "./styles/theme";
import MenuItem from "./components/MenuItem/MenuItem";



const App = () => {

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

			<div style={{ width: "300px" }}>
				<MenuItem pictogram={<Pictogram size="small" type="flight"><Flight color="white" /></Pictogram>} text="Celebration" />
			</div>
		</div>
	);
};

export default App;
