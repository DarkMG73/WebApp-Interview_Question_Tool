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
    const addTopicPromise = new Promise(function (resolve, reject) {
      if (typeof props.questionIdentifier != "string") {
        reject({
          status: false,
          message:
            "There was a problem. Please try again or contact the site admin.\nError: Identifier must be a string",
        });
      } else {
        newStudyTopicsIDs.push(questionIdentifier);

        if (studyNotes.studyTopicsIDs.includes(questionIdentifier)) {
          resolve({
            status: false,
            message: "That topic ID is already in your Study Topics list.",
          });
        } else {
          newStudyNotes.studyTopicsIDs = [...newStudyTopicsIDs];
          dispatch(questionDataActions.addStudyTopicID(questionIdentifier));

          if (user) {
            console.log(
              "%c --> %cline:33%cif (user)",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
              !!user
            );

            updateStudyNotes({ user, dataObj: newStudyNotes })
              .then((res) => {
                resolve({
                  status: true,
                  message: "The topic was successfully added",
                });
              })
              .catch((err) => {
                reject({
                  status: false,
                  message:
                    "There was an error trying to add this ID. Please try again and contact the site admin if the problem continues.",
                });
              });
          }
          if (!user) {
            storage("ADD", {
              studyNotes: newStudyNotes,
              ...otherQuestionData,
            });
            resolve({
              status: true,
              message: "The topic was successfully added",
            });
          }
        }
      }
    });

    return addTopicPromise;
  };

  return studyTopicIdAddToStorage;
};

export default useStudyTopicIdAddToStorage;
