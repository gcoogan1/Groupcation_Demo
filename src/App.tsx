import Pictogram from "./components/Pictogram/Pictogram";
import Groupcation from "./assets/Groupcation.svg?react"; // IMPORTANT -> .svg?react

const App = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				flexDirection: 'column',
				gap: '6px',
				width: '100%'
			}}
		>
			<h1>Groupcation - To The Alps</h1>
			<Pictogram size="medium" type="primaryOpacity" >
				<Groupcation style={{ color: "#E40078" }} />
			</Pictogram>
		</div>
	);
};

export default App;
