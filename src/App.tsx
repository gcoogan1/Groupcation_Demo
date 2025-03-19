// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import InputTextArea from "./components/Inputs/InputTextArea/InputTextArea";
import Route from "./components/Route/Route";

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
			<div style={{ minHeight: '600px' }}>
				<Route 
					notesText="This train is added for illustrative purposes and should be updated to match the correct data." 
					onEditClick={() => console.log("Edit")} 
					hightlightedRouteAction={"Walk"} 
					routeText={"5 mins to Montreux Train Station"} 
					footerText={"Hiren Bahri on 15 Jan 2025"}					
					/>
			</div>
		</div>
	);
};

export default App;
