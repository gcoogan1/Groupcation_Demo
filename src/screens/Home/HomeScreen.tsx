// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { Link } from "react-router-dom";

const HomeScreen = () => {

  // type AvatarThemeKeys = keyof typeof avatarTheme;

  // type Traveler = {
  // 	initials: string;
  // 	color: AvatarThemeKeys;
  // };

  // interface ActivityCardDetails {
  // 	activityTitle: string;
  // 	activitySubTitle: string;
  // 	depatureTime: string;
  // 	departureLocation: string;
  // 	durationTime: string;
  // 	arrivalTime: string;
  // 	arrivalLocation: string;
  // 	travelers: Traveler[];
  // }

  // const activityCard: ActivityCardDetails = {
  // 	activityTitle: "GoldenPass Express",
  // 	activitySubTitle: "Prestige Class",
  // 	depatureTime: "7:33am - Tue, 27th May 2025",
  // 	departureLocation: "Montreux",
  // 	durationTime: "3hrs 15mins",
  // 	arrivalTime: "10:48am - Tue, 27 May 2025",
  // 	arrivalLocation: "Interlaken Ost",
  // 	travelers: [
  // 		{ initials: "hb", color: "purple" },
  // 		{ initials: "lm", color: "red" },
  // 		{ initials: "pv", color: "gold" },
  // 	],
  // };
  const trains = useSelector((state: RootState) => state.train.trains);
  const stays = useSelector((state: RootState) => state.stay.stays);

  console.log("trains", stays)


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // minHeight: "100vh",
        flexDirection: "column", 
        gap: "6px",
        width: "100%",
        padding: "20px",
      }}
    >
      <h1>Groupcation - To The Alps</h1>
      <Link to="/train-form">Add Train</Link>
      <Link to="/train-form/1e5e6a36-8c01-4b68-bbbb-5c1813fe77d3">Update Train</Link>

      <Link to="/stay-form">Add Stay</Link>
      <Link to="/stay-form/437f28c6-1d5b-445b-999c-7c6cabcd968b">Update Stay</Link>

      {/* <div style={{ minHeight: "600px" }}>
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
        <Activity
          pictogram={
            <Pictogram type="train" size={"medium"}>
              <Train color={theme.base} />
            </Pictogram>
          }
          onEditClick={() => console.log("Edit")}
          onAddNotesClick={() => console.log("Notes")}
          onAttachmentClick={() => console.log("Attachments")}
          cost="345.50"
          onCostClick={() => console.log("cost")}
          noteText="This train is added for illustrative purposes and should be updated to match the correct data."
          hightlightedActivityAction={"Train"}
          activityText={"from Montreux to Interlaken Ost"}
          departureTime="Leaves at 7:33am"
          footerText={"Hiren Bahri on 15 Jan 2025"}
          activityCardDetails={activityCard}
        />
      </div> */}
    </div>
  );
};

export default HomeScreen;
