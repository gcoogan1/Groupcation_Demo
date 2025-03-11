import Walking from "./assets/Walking.svg?react"; // IMPORTANT -> .svg?react
import GraphicRoute from "./components/GraphicRoute/GraphicRoute";

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
			<GraphicRoute type="walking" >
				<Walking style={{ color: "#BD8E62" }} />
			</GraphicRoute>
		</div>
	);
};

export default App;
