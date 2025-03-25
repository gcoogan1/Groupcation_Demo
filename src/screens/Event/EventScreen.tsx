import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import EventForm from "../../modules/activities/event/components/EventForm";

const EventScreen = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={eventId ? "Update" : "Add New"}
			formTitleAction="Event"
		>
			<EventForm eventId={eventId} />
		</PageWrapper>
	);
};

export default EventScreen;