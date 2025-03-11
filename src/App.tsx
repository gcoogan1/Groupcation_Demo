// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react
import Avatar from "./components/Avatar/Avatar";

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
			<Avatar color="brown" initials="gc" />
		</div>
	);
};

export default App;
