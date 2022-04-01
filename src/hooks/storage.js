function storage(action, data) {
  data = JSON.stringify(data);

  let output = null;
  if (action === "add") {
    output = localStorage.setItem("gi-interview-questions", data);
  }

  if (action === "get") {
    output = JSON.parse(localStorage.getItem("gi-interview-questions"));
  }

  return output;
}

export default storage;
