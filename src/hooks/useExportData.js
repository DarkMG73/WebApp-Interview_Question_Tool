import { useSelector } from "react-redux";

const useExportData = (props) => {
  const { questionHistory, filteredQuestionsIds } = useSelector(
    (state) => state.questionData
  );
  const totalQuestions = filteredQuestionsIds.length;
  const { correct, incorrect, unmarked } = questionHistory;
  const correctAmount = tallyItemsInObject(correct);
  const incorrectAmount = tallyItemsInObject(incorrect);
  const unmarkedAmount = tallyItemsInObject(unmarked);
  const totalCompleted = correctAmount + incorrectAmount + unmarkedAmount;
  const score =
    ((correctAmount / totalCompleted) * 100).toFixed(1) + "% Correct";
  function tallyItemsInObject(obj) {
    let output = 0;
    for (const i in obj) {
      output++;
    }
    return output;
  }

  const generateExport = function (props) {
    console.log(
      "%c --> %cline:94%ctype",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      props.type
    );
    console.log(
      "%c --> %cline:31%ctype === json",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      props.type === "json"
    );
    if (props.type === "json") {
      exportJSON(questionHistory, score, totalQuestions);
    } else {
      var headers = {
        score: score,
        totalQuestions:
          totalCompleted + " answered of " + totalQuestions + "questions.",
        level: "Level",
        topic: "Topic",
        title: "Question",
        question: "Question Detail".replace(/,/g, ""), // remove commas to avoid errors
        answer: "Answer",
        time: "Time",
      };

      const itemsReadyForCVS = formatAnObject(questionHistory["incorrect"]);
      console.log(
        "%c --> %cline:34%cquestionHistory",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
        questionHistory
      );
      console.log(
        "%c --> %cline:34%citemsReadyForCVS",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
        itemsReadyForCVS
      );

      // format the data
      function formatAnObject(obj) {
        console.log(
          "%c --> %cline:44%cobj",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
          obj
        );
        var itemsFormatted = [];
        let count = 1;
        for (const key in obj) {
          const item = obj[key];
          itemsFormatted.push({
            score: count,
            totalQuestions: key,
            level: item.level || "-",
            topic: item.topic || "-",
            title: JSON.stringify(item.title) || "-",
            question: item.question.replace(/,/g, "") || "-", // remove commas to avoid errors,
            answer: JSON.stringify(item.answer.replace(/,/g, "")) || "-",
            time: item.time,
          });
          count++;
        }

        return itemsFormatted;
      }

      const fileName = prompt("What would you like to name the file?");
      let exportFileName = fileName || "interview_questions_list.json";
      console.log(
        "%c --> %cline:64%cexportFileName",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
        exportFileName
      );
      exportCSVFile(headers, itemsReadyForCVS, exportFileName); // call the exportCSVFile() function to process the JSON and trigger the download
    }
  };

  return generateExport;
};

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

const exportJSON = function (questionHistory, score, totalQuestions) {
  const fileName = prompt("What would you like to name the file?");
  const jsonData = questionHistory;
  const newQuestRecord = {
    ...questionHistory,
  };
  newQuestRecord.stats = {
    score: score,
    totalQuestions: totalQuestions,
  };
  let dataStr = JSON.stringify(newQuestRecord);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "interview_questions_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

export default useExportData;
