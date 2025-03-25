import PageWrapper from "../../components/PageWrapper/PageWrapper";
import RentalForm from "../../modules/activities/rental/components/RentalForm";
import { useNavigate, useParams } from "react-router-dom";

const RentalScreen = () => {
	const { rentalId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={rentalId ? "Update" : "Add New"}
			formTitleAction="Rental"
		>
			<RentalForm rentalId={rentalId} />
		</PageWrapper>
	);
};

export default RentalScreen;