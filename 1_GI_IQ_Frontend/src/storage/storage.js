import Cookies from "universal-cookie";
const appCookieName = "gi-interview-questions-tool-local";

function storage(action, data, name) {
  data = JSON.stringify(data);
  const storageFileName = name ? name : appCookieName;
  let output = null;
  if (action === "ADD") {
    output = localStorage.setItem(storageFileName, data);
  }

  if (action === "GET") {
    output = localStorage.getItem(storageFileName);
    try {
      output = JSON.parse(output);
    } catch {}
  }

  if (action === "DELETE") {
    output = localStorage.removeItem(storageFileName);
  }

  return output;
}

export function StorageForSession(action, data, name) {
  if (data && Object.keys(data).length > 0 && data.hasOwnProperty("token"))
    data = JSON.stringify(data.token);

  const storageFileName = name ? name : appCookieName;

  const cookies = new Cookies();

  let output = null;
  if (action === "ADD") {
    output = cookies.set(storageFileName, data, {
      path: "/",
      expires: new Date(Date.now() + 2592000),
    });
    // output = sessionStorage.setItem(storageFileName, data);
  }

  if (action === "GET") {
    output = cookies.get(storageFileName);
    // output = sessionStorage.getItem(storageFileName);
    try {
      output = JSON.parse(output);
    } catch (error) {}

    if (output && output.hasOwnProperty("token")) output = output.token;
  }

  if (action === "DELETE") {
    // Using set instead of remove to allow
    // any page in any tab to delete cookie.
    output = cookies.set(storageFileName, " ", {
      path: "/",
      expires: new Date(Date.now()),
    });
    // output = sessionStorage.removeItem(storageFileName);
  }

  return output;
}

export default storage;
