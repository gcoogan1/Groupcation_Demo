import PageWrapper from "../../components/PageWrapper/PageWrapper";
import NoteForm from "../../modules/extras/note/components/NoteForm";
import { useNavigate, useParams } from "react-router-dom";

const NoteScreen = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate("/");
  };

  return (
    <PageWrapper
      onClose={handleOnClose}
      groupcationTitle={`Hiren & Gen's "To The Alps" Wedding`}
      formTitle={noteId ? "Update" : "Add New"}
      formTitleAction="Note"
    >
      <NoteForm noteId={noteId} />
    </PageWrapper>
  );
};

export default NoteScreen;
