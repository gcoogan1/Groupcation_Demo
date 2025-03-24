import PageWrapper from "../../components/PageWrapper/PageWrapper";
import TrainForm from "../../modules/activities/train/components/TrainForm";
import { useNavigate } from "react-router-dom";

const TrainScreen = () => {
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle="Add New"
			formTitleAction="Train"
		>
			<TrainForm />
		</PageWrapper>
	);
};

export default TrainScreen;
