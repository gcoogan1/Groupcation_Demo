import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "@components/PageWrapper/PageWrapper";
import BusForm from "@modules/activities/bus/components/BusForm";

const BusScreen = () => {
	const { busId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={busId ? "Update" : "Add New"}
			formTitleAction="Bus"
		>
			<BusForm busId={busId} />
		</PageWrapper>
	);
};

export default BusScreen;