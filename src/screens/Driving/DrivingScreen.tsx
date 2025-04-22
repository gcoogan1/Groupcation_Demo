import PageWrapper from "@components/PageWrapper/PageWrapper";
import DrivingRouteForm from "@modules/routes/driving/components/DrivingRouteForm";
import { useNavigate, useParams } from "react-router-dom";

const DrivingScreen = () => {
  const { drivingId } = useParams();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate("/");
  };

  return (
    <PageWrapper
      onClose={handleOnClose}
      groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
      formTitle={drivingId ? "Update" : "Add New"}
      formTitleAction="Driving Route"
    >
      <DrivingRouteForm drivingId={drivingId} />
    </PageWrapper>
  );
};

export default DrivingScreen;
