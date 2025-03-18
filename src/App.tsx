// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react


import InputTextArea from "./components/Inputs/InputTextArea/InputTextArea";



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

			<div style={{ width: '280px'}}>
			<InputTextArea label={"Label"} name={"message"} placeholder="User Input tEXT" />
			</div>
		</div>
	);
};

export default App;
