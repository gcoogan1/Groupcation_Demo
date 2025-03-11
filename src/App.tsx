// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import FilterChip from "./components/FilterChip/FilterChip";

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
			<FilterChip filterText="21 Travelers" onClick={() => console.log("Filter")} />
		</div>
	);
};

export default App;
