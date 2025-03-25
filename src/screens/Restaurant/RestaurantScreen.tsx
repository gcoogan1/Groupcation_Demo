import PageWrapper from "../../components/PageWrapper/PageWrapper";
import RestaurantForm from "../../modules/activities/restaurant/components/RestaurantForm";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantScreen = () => {
	const { restaurantId } = useParams();
	const navigate = useNavigate();

	const handleOnClose = () => {
		navigate("/");
	};

	return (
		<PageWrapper
			onClose={handleOnClose}
			groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
			formTitle={restaurantId ? "Update" : "Add New"}
			formTitleAction="Restaurant"
		>
			<RestaurantForm restaurantId={restaurantId} />
		</PageWrapper>
	);
};

export default RestaurantScreen;