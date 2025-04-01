// IMPORTANT IMPORT ADD-ON FOR SVGS -> .svg?react

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/index";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroupcationTable } from "../../store/thunk/groupcationThunk";
import { fetchTrainByGroupcationId } from "../../modules/activities/train/thunk/trainThunk";
import { fetchUsersTable } from "../../store/thunk/usersThunk";
import { convertUsersToTravelers } from "../../utils/conversionFunctions/conversionFunctions";
import { selectGroupcationById, selectTrains } from "../../store/selectors/selectors";

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchGroupcationTable(333));
    dispatch(fetchTrainByGroupcationId(333))
    dispatch(fetchUsersTable())
  }, [dispatch]);

  const groupcation = useSelector((state: RootState) => selectGroupcationById(state, 333));
  const trains = useSelector(selectTrains);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetching groupcations table data
  //       const { data: groupcationsData, error: groupcationError } = await supabase
  //         .from("groupcations")
  //         .select("*")
  //         .eq("id", 333); // Filter by groupcation ID 333

  //       if (groupcationError) {
  //         console.error("Error fetching groupcations:", groupcationError.message);
  //       } else {
  //         console.log("Groupcation:", groupcationsData)
  //       }

  //       // Fetching user table data
  //       const { data: usersData, error: userError } = await supabase
  //         .from("users")
  //         .select("*")
  //         .eq("id", 3); // Filter by user ID 3

  //       if (userError) {
  //         console.error("Error fetching users:", userError.message);
  //       } else {
  //         console.log("User:", usersData)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
  // const trains = useSelector((state: RootState) => state.train.trains);
  // const groupcations = useSelector((state: RootState) => state.groupcation.groupcations);
  const users = useSelector((state: RootState) => state.user.users);
  // const stays = useSelector((state: RootState) => state.stay.stays);
  // const flights = useSelector((state: RootState) => state.flight.flights);

  console.log("Groupcations:", groupcation)
  console.log("Trains:", trains);
  console.log("Users:", convertUsersToTravelers(users))

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
      <Link to="/train-form/44">Update Train</Link>

      <Link to="/stay-form">Add Stay</Link>
      <Link to="/stay-form/437f28c6-1d5b-445b-999c-7c6cabcd968b">
        Update Stay
      </Link>

      <Link to="/flight-form">Add Flight</Link>
      <Link to="/flight-form/ce79403c-ad1d-4eab-b0bb-bb1ad2725aee">
        Update Flight
      </Link>

      <Link to="/bus-form">Add Bus</Link>
      <Link to="/bus-form/52e3e2cd-09b0-460a-bc36-0be5a5c7bca8">
        Update Bus
      </Link>

      <Link to="/boat-form">Add Boat</Link>
      <Link to="/boat-form/694ef18b-eb44-449c-832a-e71569a4ddae">
        Update Boat
      </Link>

      <Link to="/rental-form">Add Rental</Link>
      <Link to="/rental-form/8c179fa3-6fe9-409e-921e-e4f1572569f3">
        Update Rental
      </Link>

      <Link to="/restaurant-form">Add Restaurant</Link>
      <Link to="/restaurant-form/32599cac-ffe9-4166-b4a3-a9ee2d2f2a4a">
        Update Restaurant
      </Link>

      <Link to="/event-form">Add Event</Link>
      <Link to="/event-form/2f0402d6-e36b-41ee-adf5-0b0759c63f90">
        Update Event
      </Link>

      <Link to="/walking-form">Add Walking</Link>
      <Link to="/walking-form/a72a3b1e-4f1a-4581-9746-af29c3322feb">
        Update Walking
      </Link>

      <Link to="/driving-form">Add Driving</Link>
      <Link to="/driving-form/897cbed1-4456-4496-a781-266b1bc6eee8">
        Update Driving
      </Link>

      <Link to="/note-form">Add Note</Link>
      <Link to="/note-form/a32362ae-71fe-4c59-9e4e-b5da3ea019b2">
        Update Note
      </Link>

      <Link to="/linked-trip-form">Add Linked Trip</Link>
      <Link to="/linked-trip-form/5fb14f35-abb4-4a23-9d00-fe8e09ffa293">
        Update Linked Trip
      </Link>
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
