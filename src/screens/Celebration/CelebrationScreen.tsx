import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import CelebrationForm from "../../modules/activities/celebration/components/CelebrationForm";

const CelebrationScreen = () => {
	const { celebrationId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={celebrationId ? "Update" : "Add New"}
			formTitleAction="Celebration"
		>
			<CelebrationForm celebrationId={celebrationId} />
		</PageWrapper>
	);
};

export default CelebrationScreen;