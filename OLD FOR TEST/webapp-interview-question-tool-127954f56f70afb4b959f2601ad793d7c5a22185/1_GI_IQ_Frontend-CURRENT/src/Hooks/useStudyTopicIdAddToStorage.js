import { useSelector, useDispatch } from "react-redux";
import { questionDataActions } from "../store/questionDataSlice";
import { updateStudyNotes } from "../storage/userDB";
import storage from "../storage/storage";

const useStudyTopicIdAddToStorage = () => {
  const dispatch = useDispatch();
  const { studyNotes, ...otherQuestionData } = useSelector(
    (state) => state.questionData
  );
  const user = useSelector((state) => state.auth.user);

  const studyTopicIdAddToStorage = (props) => {
    const output = { status: false, message: "Nothing was processed." };
    const questionIdentifier = props.questionIdentifier;
    const newStudyTopicsIDs = [...studyNotes.studyTopicsIDs];
    const newStudyNotes = { ...studyNotes };

    if (typeof props.questionIdentifier != "string") {
      output.status = false;
      output.message =
        "There was a problem. Please try again or contact the site admin.\nError: Identifier must be a string";
    } else {
      newStudyTopicsIDs.push(questionIdentifier);

      if (studyNotes.studyTopicsIDs.includes(questionIdentifier)) {
        output.status = false;
        output.message = "That topic ID is already in your Study Topics list.";
      } else {
        newStudyNotes.studyTopicsIDs = [...newStudyTopicsIDs];
        dispatch(questionDataActions.addStudyTopicID(questionIdentifier));

        if (user)
          output.message = updateStudyNotes({ user, dataObj: newStudyNotes })
            .then((res) => {
              output.status = true;
              output.message = "The topic was successfully added";
            })
            .catch((err) => {});

        if (!user) {
          output.message = storage("ADD", {
            studyNotes: newStudyNotes,
            ...otherQuestionData,
          });
          output.status = true;
          output.message = "The topic was successfully added";
        }
      }
    }
    return output;
  };

  return studyTopicIdAddToStorage;
};

export default useStudyTopicIdAddToStorage;
