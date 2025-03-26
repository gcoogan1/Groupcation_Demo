import PageWrapper from "../../components/PageWrapper/PageWrapper";
import WalkingRouteForm from "../../modules/routes/walking/components/WalkingRouteForm";
import { useNavigate, useParams } from "react-router-dom";

const WalkingScreen = () => {
  const { walkingId } = useParams();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate("/");
  };

  return (
    <PageWrapper
      onClose={handleOnClose}
      groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
      formTitle={walkingId ? "Update" : "Add New"}
      formTitleAction="Walking Route"
    >
      <WalkingRouteForm walkingId={walkingId} />
    </PageWrapper>
  );
};

export default WalkingScreen;
