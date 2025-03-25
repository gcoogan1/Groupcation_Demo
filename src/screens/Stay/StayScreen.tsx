import PageWrapper from "../../components/PageWrapper/PageWrapper";
import StayForm from "../../modules/activities/stay/components/StayForm";
import { useNavigate, useParams } from "react-router-dom";

const StayScreen = () => {
	const { stayId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

  console.log(stayId)

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={stayId ? "Update" : "Add New"}
			formTitleAction="Stay"
		>
			<StayForm stayId={stayId} />
		</PageWrapper>
	);
};

export default StayScreen;