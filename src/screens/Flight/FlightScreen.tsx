import PageWrapper from "@components/PageWrapper/PageWrapper";
import FlightForm from "@modules/activities/flights/components/FlightForm";
import { useNavigate, useParams } from "react-router-dom";

const FlightScreen = () => {
	const { flightId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={flightId ? "Update" : "Add New"}
			formTitleAction="Flight"
		>
			<FlightForm flightId={flightId} />
		</PageWrapper>
	);
};

export default FlightScreen;