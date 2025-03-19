// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import { Route } from "react-router-dom";
import Note from "./components/Note/Note";
import ActivityRoute from "./components/Route/Route";

const App = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				flexDirection: "column",
				gap: "6px",
				width: "100%",
			}}
		>
			<h1>Groupcation - To The Alps</h1>
			<div style={{ minHeight: "600px" }}>
				<Note
					onEditClick={() => console.log("Edit")}
					hightlightedNoteAction={"Note"}
					noteText={"What to do on the first few days that you are here."}
					extendedNotesTitle={
						"What to do on the first few days that you are here."
					}
					extendedNoteText={
						"This train is added for illustrative purposes and should be updated to match the correct data. This train is added for illustrative purposes and should be updated to match the correct data."
					}
					footerText={"Hiren Bahri on 15 Jan 2025"}
				/>
			<ActivityRoute 
					onEditClick={() => console.log("Edit")}
					hightlightedRouteAction={"Walk"} 
					routeText={"Walk 5 mins to Montreux Train Station"} 
					notesText={"This train is added for illustrative purposes and should be updated to match the correct data."} 
					footerText={"Hiren Bahri on 15 Jan 2025"}				
			/>
			</div>
		</div>
	);
};

export default App;
