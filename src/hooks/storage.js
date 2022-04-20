function storage(action, data) {
  data = JSON.stringify(data);

  let output = null;
  if (action === "add") {
    output = localStorage.setItem("gi-interview-questions", data);
  }

  if (action === "get") {
    output = JSON.parse(localStorage.getItem("gi-interview-questions"));
  }

  if (action === "delete") {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your question history? If you do, this will erase your question history from your local browser storage. This will not affect the question database."
    );
    if (shouldDelete)
      output = localStorage.removeItem("gi-interview-questions");
  }

  return output;
}

export default storage;
