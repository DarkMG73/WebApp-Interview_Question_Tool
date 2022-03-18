function storage(action, data) {
  data = JSON.stringify(data);
  console.log(
    "%c --> %cline:1%cdata",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
    data
  );
  console.log(
    "%c --> %cline:1%caction",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
    action
  );
  let output = null;
  if (action === "add") {
    output = localStorage.setItem("gi-interview-questions", data);
  }

  if (action === "get") {
    output = JSON.parse(localStorage.getItem("gi-interview-questions"));
  }

  console.log(
    "%c --> %cline:13%coutput",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
    output
  );
  return output;
}

export default storage;
