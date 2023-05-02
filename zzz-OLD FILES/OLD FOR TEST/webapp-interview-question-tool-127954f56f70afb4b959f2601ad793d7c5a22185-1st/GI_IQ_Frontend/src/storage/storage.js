const appCookieName = "gi-interview-questions-local";

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
    output = localStorage.removeItem("gi-interview-questions");
  }

  return output;
}

export function StorageForSession(action, data, name) {
  if (data && Object.keys(data).length > 0) data = JSON.stringify(data);
  const storageFileName = name ? name : appCookieName;

  let output = null;
  if (action === "ADD") {
    output = sessionStorage.setItem(storageFileName, data);
  }

  if (action === "GET") {
    output = sessionStorage.getItem(storageFileName);
    try {
      output = JSON.parse(output);
    } catch (error) {}

    if (output && output.hasOwnProperty("token")) output = output.token;
  }

  if (action === "DELETE") {
    output = sessionStorage.removeItem(storageFileName);
  }

  return output;
}

export default storage;
