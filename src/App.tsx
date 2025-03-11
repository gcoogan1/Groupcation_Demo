// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react
import AvatarStack from "./components/AvatarStack/AvatarStack";
import { avatarTheme } from "./styles/theme";

const App = () => {

	type AvatarThemeKeys = keyof typeof avatarTheme;
	
	type Traveler = {
		initials: string;
		color: AvatarThemeKeys;
	};

	const travelers: Traveler[] = [
		{
			initials: "gc",
			color: "red",
		},
		{
			initials: "hb",
			color: "orange",
		},
		{
			initials: "pv",
			color: "pink",
		},
		{
			initials: "mh",
			color: "purple",
		},
		{
			initials: "cc",
			color: "gold",
		},
		{
			initials: "ac",
			color: "red",
		},

	];

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
			<AvatarStack travelers={travelers} onClick={() => console.log("Clicked!")} />
		</div>
	);
};

export default App;
