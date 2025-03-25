import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BoatForm from "../../modules/activities/boat/components/BoatForm";

const BoatScreen = () => {
	const { boatId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={boatId ? "Update" : "Add New"}
			formTitleAction="Boat"
		>
			<BoatForm boatId={boatId} />
		</PageWrapper>
	);
};

export default BoatScreen;