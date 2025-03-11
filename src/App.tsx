// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import LinkedTrip from "./components/LinkedTrip/LinkedTrip";
import { avatarTheme } from "./styles/theme";
import BackgroundImg from "./assets/background.jpeg";

const App = () => {
	type AvatarThemeKeys = keyof typeof avatarTheme;

	type Traveler = {
		initials: string;
		color: AvatarThemeKeys;
	};

	const travelers: Traveler[] = [
		{
			initials: "bc",
			color: "red",
		},
		{
			initials: "ab",
			color: "orange",
		},
		{
			initials: "ov",
			color: "pink",
		},
		{
			initials: "bc",
			color: "purple",
		},
		{
			initials: "jc",
			color: "gold",
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

			<div style={{ width: "400px" }}>
				<LinkedTrip
					tripName={"Billy and Annie's Ireland Family Vacation"}
					duration={"20 May 2025 to 26 May 2025"}
					travelers={travelers}
					backgroundImg={BackgroundImg}
				/>
			</div>
		</div>
	);
};

export default App;
