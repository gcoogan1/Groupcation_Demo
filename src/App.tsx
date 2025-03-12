// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import Button from "./components/Button/Button";
import ChevRight from "./assets/Chevron_Right.svg?react"
import { theme } from "./styles/theme";



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
				<Button
					rightIcon={<ChevRight color={theme.secondary} />} 
					color={"outlined"} 
					onClick={() => console.log("Add Train")}
					ariaLabel={"Add Train"}				
					>
						Add Train
					</Button>
			</div>
		</div>
	);
};

export default App;
