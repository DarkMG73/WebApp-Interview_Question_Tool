import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcUYjzGRWxlPHq0Cf4S3suCb6emXl8j4",
  authDomain: "program-planner-48e32.firebaseapp.com",
  databaseURL: "https://program-planner-48e32.firebaseio.com",
  projectId: "program-planner-48e32",
  storageBucket: "program-planner-48e32.appspot.com",
  messagingSenderId: "103146158602",
  appId: "1:103146158602:web:def5b42dbbed3fa413bdf3",
  measurementId: "G-YXCVF55B0G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// Get a list of cities from your database
async function getDBData(db, name) {
  const citiesCol = collection(db, name);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(
    "%c --> %cline:35%ccityList",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
    cityList
  );
  return cityList;
}

async function addDocument(dbName, id, dataObject, refresh) {
  try {
    const docRef = await setDoc(doc(db, dbName, id), dataObject);
    console.log("Document written with ID: ", id, docRef);
    alert("Document written with ID: " + id);
    if (refresh) {
      window.location.href = window.location.href;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function removeDocument(dbName, id) {
  try {
    const docRef = await deleteDoc(doc(db, dbName, id));
    console.log("Document deleted with an ID of: ", id, docRef);
    alert("Document deleted with an ID of: " + id);
  } catch (e) {
    console.error("Error removing document: ", e);
  }
}

// Get DB Data
export const questionData = getDBData(db, "interview_questions");

// Add a document to the database
export const addDocToDB = function (id, dataObject) {
  addDocument("interview_questions", id, dataObject);
};

// Delete a document to the database
export const deleteDocFromDb = function (id) {
  removeDocument("interview_questions", id);
};

console.log("🔵 | questionData", questionData);
export default db;
