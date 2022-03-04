import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
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

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// console.log("🔵 | db", db);
// const dbCollection = collection("interview_questions");
// console.log("🔵 | dbCollection", dbCollection);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getDBData(db, name) {
  const citiesCol = collection(db, name);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export const questionData = getDBData(db, "interview_questions");
console.log("🔵 | questionData", questionData);
export default db;
