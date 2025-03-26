import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import LinkedTripForm from "../../modules/extras/linkedTrip/components/LinkedTripForm";

const LinkedTripScreen = () => {
  const { linkedTripId } = useParams();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate("/");
  };

  return (
    <PageWrapper
      onClose={handleOnClose}
      groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
      formTitle={linkedTripId ? "Update" : "Add New"}
      formTitleAction="Linked Trip"
    >
      <LinkedTripForm linkedTripId={linkedTripId} />
    </PageWrapper>
  );
};

export default LinkedTripScreen;
