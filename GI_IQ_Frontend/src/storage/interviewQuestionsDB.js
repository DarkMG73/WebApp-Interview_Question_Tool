import axios from "axios";

/// GET THE PLUGINS/////////////////////////////
export const questionData = async (user) => {
  let axiosConfig = null;

  if (user) {
    axiosConfig = {
      headers: {
        "Content-Type": "text/plain",
        Authorization: "JWT " + user.token,
      },
      timeout: 60000,
    };
  }

  try {
    const res = await axios.post(
      "/api/all-interview-questions/",
      user,
      axiosConfig
    );
    return res.data;
  } catch (err) {
    console.log(
      "%c --> %cline:38%cerr",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      err
    );
    return [];
  }
};

/// GET ONE PLUGIN /////////////////////////////
export const getQuestionBy_Id = async (user, question_Id) => {
  let axiosConfig = null;

  if (user) {
    axiosConfig = {
      headers: {
        "Content-Type": "text/plain",
        Authorization: "JWT " + user.token,
      },
      timeout: 60000,
    };
  }

  const res = await axios.post(
    "/api/all-interview-questions/" + question_Id,
    user,
    axiosConfig
  );
  return res.data;
};

/// SAVE ONE /////////////////////////////////////
export async function addDocToDB(userAndDataObject) {
  console.log("userAndDataObject", userAndDataObject);
  console.log(
    "%c --> %cline:73%cuserAndDataObject",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
    userAndDataObject
  );
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(`/api/all-interview-questions/add/`, userAndDataObject, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      // console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}

/// SAVE MANY /////////////////////////////////
export async function saveManyQuestions(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(
      `/api/all-interview-questions/add-many/`,
      userAndDataObject,
      axiosConfig
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      // console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}

/// UPDATE //////////////////////////////////
export async function updateAQuestion(id, dataObj, user) {
  dataObj.identifier = id;
  console.log(
    "%c --> %cline:121%cdataObj",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    dataObj
  );
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };

  const response = await axios
    .post(`/api/all-interview-questions/update/`, { dataObj }, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      // console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}

/// DELETE ////////////////////////////////
export async function deleteDocFromDb(id, user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/all-interview-questions/${id}/delete/`, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}

/// DELETE ALL ///////////////////////////
export async function deleteAllQuestions(user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/all-interview-questions/deleteAll/`, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%c --> %cline:102%cerr",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
        err
      );
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
      return err;
    });
  return response;
}

/// GET AUDIO PLUGIN SCHEMA //////////////
export async function getSchemaForInterviewQuestion() {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const output = await axios
    .get(`/api/all-interview-questions/model/`, axiosConfig)
    .then((res) => {
      return res.data.model;
    })
    .catch((err) => {
      const output = { response: { request: {} } };
      console.log("err", err);
      console.log("output", output);

      if (err.code && err.code === "ERR_NETWORK") {
        output.response.status = 500;
        output.response.statusText = err.message;
        output.response.request.responseURL = err.config.baseURL;
      }
      return output.response;
    });

  return output;
}
